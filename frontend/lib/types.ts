// Tipe data Fix-In (UI-only).
// ReportStatus & created_at + photo_url + description mengikuti backend (backend/main.py).
// severity, category, code, locationText, kecamatan, photos = frontend-only (belum ada di backend).

export type ReportStatus = "menunggu_audit" | "diperbaiki" | "selesai";

export type Severity = "ringan" | "sedang" | "berat";

// Kategori kerusakan — frontend-only, belum ada di backend.
export type Category =
  | "jalan_berlubang"
  | "jalan_retak"
  | "aspal_terkelupas"
  | "trotoar_rusak"
  | "saluran_tersumbat"
  | "lainnya";

export interface Report {
  id: string;
  /** Kode tampilan, mis. "#FX-20240518-00128" (frontend-only) */
  code: string;
  /** Sesuai backend */
  photo_url: string;
  /** Foto tambahan untuk carousel (frontend-only) */
  photos: string[];
  /** Sesuai backend */
  description: string;
  /** Alamat sebagai teks (backend simpan koordinat; tanpa peta) */
  locationText: string;
  /** frontend-only */
  kecamatan: string;
  /** frontend-only */
  desa: string;
  /** frontend-only */
  severity: Severity;
  /** frontend-only */
  category: Category;
  /** Sesuai backend */
  status: ReportStatus;
  /** ISO string, sesuai backend */
  created_at: string;
}

export interface StatsSummary {
  laporanMasuk: number;
  tervalidasi: number;
  dalamProses: number;
  selesai: number;
}
