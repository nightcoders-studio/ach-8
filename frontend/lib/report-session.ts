// Sesi pelapor (UI-only, anti-duplikat lokasi).
// Setelah laporan terkirim, koordinat GPS-nya disimpan di localStorage device ini.
// Saat membuat laporan baru, bila lokasi foto berada di radius DUPLICATE_RADIUS_M
// dari salah satu lokasi yang sudah pernah dilaporkan → pengiriman dinonaktifkan.
// Tujuannya mencegah satu orang melaporkan titik yang sama berkali-kali (spam).

const STORAGE_KEY = "fixin:reported-locations";

/** Radius (meter) untuk menganggap dua lokasi sebagai laporan yang sama. */
export const DUPLICATE_RADIUS_M = 20;

/** Lokasi laporan yang tersimpan di sesi pelapor. */
export interface ReportedLocation {
  latitude: number;
  longitude: number;
  /** ISO string kapan laporan dikirim. */
  reportedAt: string;
}

/**
 * Jarak antar dua koordinat dalam meter (formula Haversine — manual, tanpa
 * dependency tambahan). Cukup akurat untuk pengecekan radius puluhan meter.
 */
export function distanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const R = 6_371_000; // radius bumi (m)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Ambil daftar lokasi yang sudah pernah dilaporkan dari device ini. */
export function getReportedLocations(): ReportedLocation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is ReportedLocation =>
        typeof v?.latitude === "number" &&
        typeof v?.longitude === "number" &&
        typeof v?.reportedAt === "string",
    );
  } catch {
    return [];
  }
}

/** Simpan lokasi laporan baru ke sesi pelapor. */
export function saveReportedLocation(loc: {
  latitude: number;
  longitude: number;
}): void {
  if (typeof window === "undefined") return;
  const entry: ReportedLocation = {
    latitude: loc.latitude,
    longitude: loc.longitude,
    reportedAt: new Date().toISOString(),
  };
  try {
    const next = [...getReportedLocations(), entry];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* localStorage penuh/diblokir → abaikan, jangan ganggu alur lapor */
  }
}

/**
 * Cari laporan sebelumnya yang berada dalam `radius` meter dari titik (lat,lng).
 * Mengembalikan lokasi terdekat bila ada, atau null.
 */
export function findNearbyReport(
  latitude: number,
  longitude: number,
  radius: number = DUPLICATE_RADIUS_M,
): ReportedLocation | null {
  const target = { latitude, longitude };
  let nearest: ReportedLocation | null = null;
  let nearestDist = Infinity;

  for (const loc of getReportedLocations()) {
    const dist = distanceMeters(target, loc);
    if (dist <= radius && dist < nearestDist) {
      nearest = loc;
      nearestDist = dist;
    }
  }
  return nearest;
}
