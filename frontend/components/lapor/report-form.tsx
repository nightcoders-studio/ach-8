"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGeolocated } from "react-geolocated";
import { ImagePlus, Loader2, Send } from "lucide-react";
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
import { uploadToImgbb } from "@/lib/imgbb";
import { BANDA_ACEH, createReport } from "@/lib/api";

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

  const [severity, setSeverity] = useState<Severity>("sedang");
  const [kecamatan, setKecamatan] = useState("");
  const [desa, setDesa] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const desaOptions = kecamatan ? KECAMATAN_DESA[kecamatan] : [];

  // GPS dijalankan diam-diam. Bila tersedia, koordinat asli dipakai;
  // jika tidak, fallback ke koordinat umum Banda Aceh saat submit.
  const { coords, getPosition } = useGeolocated({
    suppressLocationOnMount: true,
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 10000,
  });

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    // Coba ambil lokasi GPS diam-diam (tanpa input alamat).
    getPosition();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!photoFile) return toast.error("Tambahkan minimal 1 foto kerusakan.");
    if (!kecamatan) return toast.error("Pilih kecamatan.");
    if (!desa) return toast.error("Pilih desa/gampong.");
    if (!description.trim())
      return toast.error("Isi deskripsi/patokan lokasi.");

    setSubmitting(true);
    const t = toast.loading("Mengunggah foto…");
    try {
      const photo_url = await uploadToImgbb(photoFile);

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
            capture="environment"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photoPreview ? (
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary">
                <Image
                  src={photoPreview}
                  alt="Pratinjau foto"
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs font-medium">
                {photoPreview ? "Ganti Foto" : "Tambah Foto"}
              </span>
            </button>
          </div>
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

      <Button type="submit" size="lg" disabled={submitting} className="w-full gap-2">
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
