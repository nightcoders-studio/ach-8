"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGeolocated } from "react-geolocated";
import { AlertTriangle, Camera, ImagePlus, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KECAMATAN_DESA, KECAMATAN_OPTIONS } from "@/lib/regions";
import type { Severity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { BANDA_ACEH, createReport } from "@/lib/api";
import {
  DUPLICATE_RADIUS_M,
  findNearbyReport,
  saveReportedLocation,
} from "@/lib/report-session";

const SEVERITIES: { value: Severity; label: string }[] = [
  { value: "ringan", label: "Ringan" },
  { value: "sedang", label: "Sedang" },
  { value: "berat", label: "Berat" },
];

// Label tingkat kerusakan dikirim ke backend (kapital sesuai skema).
const SEVERITY_LABEL: Record<Severity, string> = {
  ringan: "Ringan",
  sedang: "Sedang",
  berat: "Berat",
};

export function ReportForm() {
  const router = useRouter();

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Input dengan capture: buka aplikasi kamera bawaan (jalan walau HTTP/LAN).
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Kamera in-app (getUserMedia).
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [severity, setSeverity] = useState<Severity>("sedang");
  const [kecamatan, setKecamatan] = useState("");
  const [desa, setDesa] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Lokasi laporan sebelumnya (dari device ini) yang berjarak < 20 m.
  // Bila terisi, pengiriman laporan dinonaktifkan (anti-duplikat lokasi sama).
  const [duplicateAt, setDuplicateAt] = useState<string | null>(null);

  const desaOptions = kecamatan ? KECAMATAN_DESA[kecamatan] : [];

  // GPS dijalankan diam-diam. Bila tersedia, koordinat asli dipakai;
  // jika tidak, fallback ke koordinat umum Banda Aceh saat submit.
  const { coords, getPosition } = useGeolocated({
    suppressLocationOnMount: true,
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 10000,
  });

  // Saat GPS asli terdeteksi, cek apakah lokasi ini < 20 m dari laporan yang
  // sudah pernah dikirim device ini. Fallback Banda Aceh sengaja diabaikan agar
  // laporan tanpa GPS tidak saling memblokir (koordinatnya selalu sama).
  useEffect(() => {
    if (!coords) return;
    const nearby = findNearbyReport(coords.latitude, coords.longitude);
    setDuplicateAt(nearby?.reportedAt ?? null);
  }, [coords]);

  // Pasang foto terpilih (dari kamera maupun galeri) + picu deteksi GPS.
  function applyPhoto(file: File) {
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setPhotoFile(file);
    getPosition();
  }

  // Hapus foto yang sudah dipilih (sebelum laporan dikirim).
  function removePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    applyPhoto(file);
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function openCamera() {
    // Konteks tidak aman (mis. HTTP via IP LAN) → mediaDevices tidak ada.
    // Pakai kamera bawaan lewat input file capture (tetap buka kamera HP).
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      // Izin ditolak / kamera dipakai app lain → coba kamera bawaan.
      cameraInputRef.current?.click();
    }
  }

  function closeCamera() {
    stopCamera();
    setCameraOpen(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        applyPhoto(
          new File([blob], `kamera-${Date.now()}.jpg`, { type: "image/jpeg" }),
        );
        closeCamera();
      },
      "image/jpeg",
      0.9,
    );
  }

  // Sambungkan stream ke elemen video saat kamera dibuka; bersihkan saat unmount.
  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen]);

  useEffect(() => stopCamera, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!photoFile) return toast.error("Tambahkan minimal 1 foto kerusakan.");
    if (!kecamatan) return toast.error("Pilih kecamatan.");
    if (!desa) return toast.error("Pilih desa/gampong.");
    if (!description.trim())
      return toast.error("Isi deskripsi/patokan lokasi.");

    // Lokasi foto < 20 m dari laporan yang sudah pernah dikirim → tolak.
    if (duplicateAt)
      return toast.error(
        `Lokasi ini sudah Anda laporkan (radius ${DUPLICATE_RADIUS_M} m). Tidak perlu lapor ulang.`,
      );

    setSubmitting(true);
    const t = toast.loading("Mengunggah foto…");
    try {
      const photo_url = await uploadToCloudinary(photoFile);

      // Pakai koordinat GPS bila ada, jika tidak pakai Banda Aceh umum.
      const latitude = coords?.latitude ?? BANDA_ACEH.latitude;
      const longitude = coords?.longitude ?? BANDA_ACEH.longitude;

      toast.loading("Mengirim laporan…", { id: t });
      await createReport({
        photo_url,
        tingkat_kerusakan: SEVERITY_LABEL[severity],
        kecamatan,
        desa,
        latitude,
        longitude,
        description: description.trim(),
      });

      // Simpan lokasi ke sesi pelapor hanya bila GPS asli dipakai (bukan
      // fallback), supaya laporan tanpa GPS tidak memblokir laporan berikutnya.
      if (coords) {
        saveReportedLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }

      toast.success("Laporan berhasil dikirim. Terima kasih!", { id: t });
      router.push("/laporan");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim laporan", {
        id: t,
      });
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="space-y-6 p-5 sm:p-6">
        {/* 1. Foto Kerusakan */}
        <Section number={1} title="Foto Kerusakan" required>
          <p className="text-sm text-muted-foreground">
            Ambil/unggah foto jalan rusak (1 foto). Lokasi GPS akan dideteksi
            otomatis di latar belakang.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoChange}
          />

          {cameraOpen ? (
            // Pratinjau kamera langsung + tombol ambil/tutup.
            <div className="mt-3 space-y-3">
              <div className="relative overflow-hidden rounded-xl border border-border bg-black">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Ambil Foto
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCamera}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Tutup
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {photoPreview && (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-secondary sm:max-w-xs">
                  <Image
                    src={photoPreview}
                    alt="Pratinjau foto"
                    fill
                    sizes="320px"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    title="Hapus foto"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-destructive"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Hapus foto</span>
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={openCamera}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border py-6 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-xs font-medium">Buka Kamera</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border py-6 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs font-medium">
                    {photoPreview ? "Ganti dari Galeri" : "Pilih dari Galeri"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* 2. Tingkat Kerusakan */}
        <Section number={2} title="Tingkat Kerusakan" required>
          <div className="flex gap-2">
            {SEVERITIES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSeverity(s.value)}
                className={cn(
                  "flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  severity === s.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Section>

        {/* 3. Kecamatan */}
        <Section number={3} title="Kecamatan" required>
          <Select
            value={kecamatan}
            onValueChange={(v) => {
              setKecamatan((v as string) ?? "");
              setDesa("");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih kecamatan" />
            </SelectTrigger>
            <SelectContent>
              {KECAMATAN_OPTIONS.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Section>

        {/* 4. Desa */}
        <Section number={4} title="Desa / Gampong" required>
          <Select
            value={desa}
            onValueChange={(v) => setDesa((v as string) ?? "")}
            disabled={!kecamatan}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  kecamatan ? "Pilih desa/gampong" : "Pilih kecamatan dulu"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {desaOptions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Section>

        {/* 5. Deskripsi */}
        <Section number={5} title="Deskripsi Daerah" required>
          <p className="mb-2 text-sm text-muted-foreground">
            Jelaskan patokan lokasi sedetail mungkin — Google Maps kurang akurat
            di Aceh.
          </p>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: ±50 m dari Masjid Raya, sebelah warung kopi Solong, dekat simpang lampu merah arah Ulee Kareng."
            rows={4}
          />
        </Section>
      </Card>

      {duplicateAt && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Lokasi sudah dilaporkan</p>
            <p className="mt-0.5 text-destructive/90">
              Anda sudah pernah melaporkan titik ini (radius{" "}
              {DUPLICATE_RADIUS_M} m) pada{" "}
              {new Date(duplicateAt).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              . Pengiriman dinonaktifkan untuk mencegah laporan ganda.
            </p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting || Boolean(duplicateAt)}
        className="w-full gap-2"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {submitting ? "Mengirim…" : "Kirim Laporan"}
      </Button>
    </form>
  );
}

function Section({
  number,
  title,
  required,
  hint,
  children,
}: {
  number: number;
  title: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
          {number}
        </span>
        {title}
        {required && <span className="text-primary">*</span>}
        {hint && (
          <span className="font-normal text-muted-foreground">{hint}</span>
        )}
      </Label>
      {children}
    </div>
  );
}
