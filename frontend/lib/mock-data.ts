import type { StatsSummary } from "./types";

// Ringkasan statistik untuk hero/stats di beranda warga (angka ilustratif).
export const STATS_SUMMARY: StatsSummary = {
  laporanMasuk: 128,
  tervalidasi: 86,
  dalamProses: 34,
  selesai: 8,
};

// Fitur untuk halaman onboarding.
export const ONBOARDING_FEATURES = [
  {
    title: "Laporan Cepat",
    desc: "Ambil foto dan kirim dalam 1 menit.",
    icon: "camera",
  },
  {
    title: "Lokasi Akurat",
    desc: "Lokasi GPS terdeteksi otomatis saat melapor.",
    icon: "map-pin",
  },
  {
    title: "Pantau Status",
    desc: "Lihat perkembangan laporan secara transparan.",
    icon: "activity",
  },
  {
    title: "Bangun Kota Bersama",
    desc: "Satu laporan, satu perbaikan untuk kota.",
    icon: "users",
  },
] as const;
