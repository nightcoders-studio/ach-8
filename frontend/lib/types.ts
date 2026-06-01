// Tipe data Fix-In (UI-only).
// ReportStatus & created_at + photo_url + description + kecamatan + desa mengikuti backend (backend/main.py).
// severity, code, locationText, photos = frontend-only (turunan/tampilan).

export type ReportStatus =
  | "menunggu_audit"
  | "diperbaiki"
  | "selesai"
  | "ditolak";

export type Severity = "ringan" | "sedang" | "berat";

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
  /** Sesuai backend */
  kecamatan: string;
  /** Sesuai backend */
  desa: string;
  /** Koordinat dari backend (location.coordinates = [lng, lat]) */
  latitude: number;
  longitude: number;
  /** frontend-only */
  severity: Severity;
  /** Sesuai backend */
  status: ReportStatus;
  /** ISO string, sesuai backend */
  created_at: string;
}
