import type { ReportStatus, Severity } from "./types";

// Metadata status ringkas (dipetakan ke 3 status backend).
// `className` memakai token tema Fix-In (success/warning) yang didefinisikan di globals.css.
export const STATUS_META: Record<
  ReportStatus,
  { label: string; className: string }
> = {
  menunggu_audit: {
    label: "Menunggu Audit",
    className: "bg-secondary text-muted-foreground border border-border",
  },
  diperbaiki: {
    label: "Dalam Proses",
    className: "bg-warning/15 text-[#8a6d00] border border-warning/30",
  },
  selesai: {
    label: "Selesai",
    className: "bg-success/15 text-[#2e7d32] border border-success/30",
  },
  ditolak: {
    label: "Ditolak",
    className: "bg-destructive/10 text-destructive border border-destructive/30",
  },
};

// Peringkat tingkat kerusakan (untuk pengurutan di daftar laporan).
export const SEVERITY_RANK: Record<Severity, number> = {
  ringan: 1,
  sedang: 2,
  berat: 3,
};

export const SEVERITY_META: Record<
  Severity,
  { label: string; className: string }
> = {
  ringan: {
    label: "Ringan",
    className: "bg-success/15 text-[#2e7d32] border border-success/30",
  },
  sedang: {
    label: "Sedang",
    className: "bg-warning/15 text-[#8a6d00] border border-warning/30",
  },
  berat: {
    label: "Berat",
    className: "bg-primary/10 text-primary border border-primary/30",
  },
};

// Tahap timeline (visual). Backend persist status; ditolak ditangani terpisah.
export const TIMELINE_STEPS = [
  "Laporan Masuk",
  "Menunggu Verifikasi",
  "Dalam Proses",
  "Selesai",
] as const;

// Indeks tahap timeline yang sudah tercapai untuk tiap status backend.
// ditolak = -1 (alur normal berhenti; ditampilkan sebagai status khusus).
export const STATUS_TIMELINE_INDEX: Record<ReportStatus, number> = {
  menunggu_audit: 1,
  diperbaiki: 2,
  selesai: 3,
  ditolak: -1,
};

// Opsi untuk dropdown ubah status di panel admin.
export const STATUS_OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: "menunggu_audit", label: "Menunggu Audit" },
  { value: "diperbaiki", label: "Dalam Proses" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];
