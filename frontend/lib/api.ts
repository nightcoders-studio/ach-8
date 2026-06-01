// Klien API Fix-In — penghubung frontend ke backend FastAPI (backend/main.py).
import type { Report, ReportStatus, Severity } from "./types";

// Base URL backend.
// Default: same-origin "/backend" yang diproksikan Next ke FastAPI (lihat next.config.ts).
// Ini bikin akses lewat localhost, IP LAN, maupun tunnel HTTPS (ngrok) sama-sama jalan
// tanpa mixed-content. Set NEXT_PUBLIC_API_URL hanya jika backend benar-benar remote.
function resolveApiUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (env && !/(localhost|127\.0\.0\.1)/.test(env)) return env;
  return "/backend";
}

export const API_URL = resolveApiUrl();

// Koordinat umum Banda Aceh — dipakai saat geolokasi tidak tersedia.
export const BANDA_ACEH = { latitude: 5.5483, longitude: 95.3238 };

// Bentuk dokumen laporan mentah dari backend.
interface RawReport {
  _id: string;
  photo_url: string;
  tingkat_kerusakan?: string;
  kecamatan?: string;
  desa?: string;
  location?: { type: string; coordinates: [number, number] };
  description: string;
  status: ReportStatus;
  created_at: string;
}

const SEVERITIES: Severity[] = ["ringan", "sedang", "berat"];

function toSeverity(value?: string): Severity {
  const v = (value || "").toLowerCase() as Severity;
  return SEVERITIES.includes(v) ? v : "sedang";
}

// Placeholder lokal saat photo_url kosong/tidak valid (mis. data uji "string").
const PLACEHOLDER_IMG = "/fixin-logo.jpeg";

// next/image hanya menerima URL absolut (http/https) atau path berawalan "/".
function safePhotoUrl(value?: string): string {
  if (!value) return PLACEHOLDER_IMG;
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return value;
  } catch {
    /* bukan URL valid */
  }
  return PLACEHOLDER_IMG;
}

// Kode tampilan ringkas dari id + tanggal, mis. "#FX-20240518-A1B2C".
function buildCode(id: string, createdAt: string): string {
  const d = new Date(createdAt);
  const ymd = Number.isNaN(d.getTime())
    ? "00000000"
    : `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
        d.getDate(),
      ).padStart(2, "0")}`;
  return `#FX-${ymd}-${id.slice(-5).toUpperCase()}`;
}

// Ubah dokumen backend menjadi tipe Report yang dipakai UI.
export function mapReport(raw: RawReport): Report {
  const kecamatan = raw.kecamatan || "Banda Aceh";
  const desa = raw.desa || "";
  const locationText = desa ? `${desa}, ${kecamatan}` : kecamatan;
  const photo = safePhotoUrl(raw.photo_url);
  // location.coordinates = [longitude, latitude]
  const coords = raw.location?.coordinates;
  const longitude = coords?.[0] ?? BANDA_ACEH.longitude;
  const latitude = coords?.[1] ?? BANDA_ACEH.latitude;
  return {
    id: raw._id,
    code: buildCode(raw._id, raw.created_at),
    photo_url: photo,
    photos: [photo],
    description: raw.description,
    locationText,
    kecamatan,
    desa,
    latitude,
    longitude,
    severity: toSeverity(raw.tingkat_kerusakan),
    status: raw.status,
    created_at: raw.created_at,
  };
}

// Payload untuk membuat laporan baru (sesuai ReportSchema backend).
export interface CreateReportPayload {
  photo_url: string;
  tingkat_kerusakan: string;
  kecamatan: string;
  desa: string;
  latitude: number;
  longitude: number;
  description: string;
}

export async function getReports(): Promise<Report[]> {
  const res = await fetch(`${API_URL}/api/reports`, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal mengambil data laporan");
  const json = (await res.json()) as { data: RawReport[] };
  return (json.data || []).map(mapReport);
}

export async function getReportById(id: string): Promise<Report | null> {
  // Backend belum punya endpoint detail, jadi ambil semua lalu cari.
  const reports = await getReports();
  return reports.find((r) => r.id === id) ?? null;
}

export async function createReport(payload: CreateReportPayload): Promise<string> {
  const res = await fetch(`${API_URL}/api/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await safeDetail(res);
    throw new Error(detail || "Gagal mengirim laporan");
  }
  const json = (await res.json()) as { id: string };
  return json.id;
}

export async function login(
  username: string,
  password: string,
): Promise<string> {
  // OAuth2PasswordRequestForm butuh form-urlencoded.
  const body = new URLSearchParams({ username, password });
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const detail = await safeDetail(res);
    throw new Error(detail || "Username atau password salah");
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/reports/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    const detail = await safeDetail(res);
    throw new Error(detail || "Gagal mengubah status");
  }
}

async function safeDetail(res: Response): Promise<string | null> {
  try {
    const json = await res.json();
    if (typeof json?.detail === "string") return json.detail;
    if (Array.isArray(json?.detail)) return json.detail[0]?.msg ?? null;
  } catch {
    /* abaikan */
  }
  return null;
}
