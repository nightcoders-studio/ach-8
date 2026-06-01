"use client";

import { useState } from "react";
import { Camera, ImagePlus, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const STEPS = ["Foto", "Lokasi", "Detail", "Kirim"];

const SEVERITIES: { value: Severity; label: string }[] = [
  { value: "ringan", label: "Ringan" },
  { value: "sedang", label: "Sedang" },
  { value: "berat", label: "Berat" },
];

// Form 1 halaman bergaya mockup — UI saja, tanpa logika kirim/upload.
export function ReportForm() {
  const [severity, setSeverity] = useState<Severity>("sedang");
  const [kecamatan, setKecamatan] = useState<string>("");
  const [desa, setDesa] = useState<string>("");

  const desaOptions = kecamatan ? KECAMATAN_DESA[kecamatan] : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.info("Demo struktur halaman — fitur kirim belum aktif.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Indikator langkah */}
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  i === 0
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="mx-1 h-0.5 flex-1 bg-border" />
            )}
          </div>
        ))}
      </div>

      <Card className="space-y-6 p-5 sm:p-6">
        {/* 1. Foto Kerusakan */}
        <Section number={1} title="Foto Kerusakan" required>
          <p className="text-sm text-muted-foreground">
            Ambil foto jalan rusak (minimal 1 foto).
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="relative flex aspect-square items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground">
              <Camera className="h-7 w-7" />
            </div>
            <button
              type="button"
              onClick={() => toast.info("Demo — unggah foto belum aktif.")}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs font-medium">Tambah Foto</span>
            </button>
          </div>
        </Section>

        {/* 2. Lokasi */}
        <Section number={2} title="Lokasi" required>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              placeholder="Nama jalan, mis. Jalan T. Daud Beureueh"
              className="pl-9"
            />
          </div>
        </Section>

        {/* 3. Tingkat Kerusakan */}
        <Section number={3} title="Tingkat Kerusakan" required>
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

        {/* 4. Kecamatan */}
        <Section number={4} title="Kecamatan" required>
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

        {/* 5. Desa (nonaktif sampai kecamatan dipilih) */}
        <Section number={5} title="Desa / Gampong" required>
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

        {/* 6. Deskripsi Daerah */}
        <Section number={6} title="Deskripsi Daerah" required>
          <p className="mb-2 text-sm text-muted-foreground">
            Jelaskan patokan lokasi sedetail mungkin — Google Maps kurang akurat
            di Aceh.
          </p>
          <Textarea
            placeholder="Contoh: ±50 m dari Masjid Raya, sebelah warung kopi Solong, dekat simpang lampu merah arah Ulee Kareng."
            rows={4}
          />
        </Section>
      </Card>

      <Button type="submit" size="lg" className="w-full gap-2">
        <Send className="h-4 w-4" />
        Kirim Laporan
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
