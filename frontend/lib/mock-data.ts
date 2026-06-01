import type { Report, StatsSummary } from "./types";

// Foto placeholder (picsum) — domain diizinkan di next.config.ts.
const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

export const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    code: "#FX-20240518-00128",
    photo_url: img("fixin-a1"),
    photos: [img("fixin-a1"), img("fixin-a2"), img("fixin-a3")],
    description:
      "Lubang cukup dalam dan berbahaya saat hujan karena tergenang air. Sudah memakan korban pengendara motor.",
    locationText: "Jalan T. Daud Beureueh, Kuta Alam",
    kecamatan: "Kuta Alam",
    desa: "Peunayong",
    severity: "sedang",
    category: "jalan_berlubang",
    status: "selesai",
    created_at: "2024-05-18T09:35:00Z",
  },
  {
    id: "2",
    code: "#FX-20240519-00129",
    photo_url: img("fixin-b1"),
    photos: [img("fixin-b1"), img("fixin-b2")],
    description:
      "Aspal retak memanjang sekitar 10 meter di depan pertokoan, mulai melebar.",
    locationText: "Jalan Prof. A. Majid Ibrahim",
    kecamatan: "Baiturrahman",
    desa: "Neusu",
    severity: "berat",
    category: "jalan_retak",
    status: "diperbaiki",
    created_at: "2024-05-19T14:10:00Z",
  },
  {
    id: "3",
    code: "#FX-20240519-00130",
    photo_url: img("fixin-c1"),
    photos: [img("fixin-c1"), img("fixin-c2"), img("fixin-c3")],
    description:
      "Jalan berlubang kecil di tikungan, perlu ditambal sebelum membesar.",
    locationText: "Jalan Pocut Baren",
    kecamatan: "Baiturrahman",
    desa: "Seutui",
    severity: "ringan",
    category: "jalan_berlubang",
    status: "menunggu_audit",
    created_at: "2024-05-20T07:48:00Z",
  },
  {
    id: "4",
    code: "#FX-20240520-00131",
    photo_url: img("fixin-d1"),
    photos: [img("fixin-d1"), img("fixin-d2")],
    description:
      "Trotoar amblas dan paving terangkat, membahayakan pejalan kaki.",
    locationText: "Jalan Teuku Umar",
    kecamatan: "Lueng Bata",
    desa: "Lamseupeung",
    severity: "sedang",
    category: "trotoar_rusak",
    status: "menunggu_audit",
    created_at: "2024-05-20T16:22:00Z",
  },
  {
    id: "5",
    code: "#FX-20240521-00132",
    photo_url: img("fixin-e1"),
    photos: [img("fixin-e1"), img("fixin-e2"), img("fixin-e3")],
    description:
      "Aspal terkelupas di area lampu merah, banyak kerikil lepas berbahaya.",
    locationText: "Jalan Syiah Kuala",
    kecamatan: "Syiah Kuala",
    desa: "Lamgugob",
    severity: "berat",
    category: "aspal_terkelupas",
    status: "diperbaiki",
    created_at: "2024-05-21T08:05:00Z",
  },
  {
    id: "6",
    code: "#FX-20240521-00133",
    photo_url: img("fixin-f1"),
    photos: [img("fixin-f1")],
    description:
      "Saluran drainase tersumbat sampah, air meluap ke badan jalan saat hujan.",
    locationText: "Jalan Sultan Iskandar Muda",
    kecamatan: "Meuraxa",
    desa: "Ulee Lheue",
    severity: "sedang",
    category: "saluran_tersumbat",
    status: "selesai",
    created_at: "2024-05-22T11:40:00Z",
  },
  {
    id: "7",
    code: "#FX-20240522-00134",
    photo_url: img("fixin-g1"),
    photos: [img("fixin-g1"), img("fixin-g2")],
    description: "Lubang besar di tengah jalan utama, sangat mengganggu lalu lintas.",
    locationText: "Jalan Mohammad Hasan",
    kecamatan: "Lueng Bata",
    desa: "Batoh",
    severity: "berat",
    category: "jalan_berlubang",
    status: "menunggu_audit",
    created_at: "2024-05-23T06:55:00Z",
  },
  {
    id: "8",
    code: "#FX-20240523-00135",
    photo_url: img("fixin-h1"),
    photos: [img("fixin-h1"), img("fixin-h2"), img("fixin-h3")],
    description: "Retak rambut di permukaan jalan baru, sebaiknya dipantau.",
    locationText: "Jalan Tgk. Chik Ditiro",
    kecamatan: "Kuta Alam",
    desa: "Bandar Baru",
    severity: "ringan",
    category: "jalan_retak",
    status: "diperbaiki",
    created_at: "2024-05-24T13:18:00Z",
  },
];

export function getReportById(id: string): Report | undefined {
  return MOCK_REPORTS.find((r) => r.id === id);
}

export const STATS_SUMMARY: StatsSummary = {
  laporanMasuk: 128,
  tervalidasi: 86,
  dalamProses: 34,
  selesai: 8,
};

// Data dummy grafik laporan per minggu (untuk dashboard admin).
export const WEEKLY_REPORTS = [
  { day: "Sen", laporan: 12 },
  { day: "Sel", laporan: 18 },
  { day: "Rab", laporan: 9 },
  { day: "Kam", laporan: 22 },
  { day: "Jum", laporan: 16 },
  { day: "Sab", laporan: 25 },
  { day: "Min", laporan: 14 },
];

// Komposisi laporan per kecamatan (donut) — pengganti peta.
export const KECAMATAN_DISTRIBUTION = [
  { kecamatan: "Kuta Alam", jumlah: 45, fill: "var(--chart-1)" },
  { kecamatan: "Baiturrahman", jumlah: 28, fill: "var(--chart-2)" },
  { kecamatan: "Syiah Kuala", jumlah: 20, fill: "var(--chart-3)" },
  { kecamatan: "Meuraxa", jumlah: 18, fill: "var(--chart-4)" },
  { kecamatan: "Lueng Bata", jumlah: 17, fill: "var(--chart-5)" },
];

// Fitur untuk halaman onboarding.
export const ONBOARDING_FEATURES = [
  {
    title: "Laporan Cepat",
    desc: "Ambil foto dan kirim dalam 1 menit.",
    icon: "camera",
  },
  {
    title: "Lokasi Akurat",
    desc: "Cukup tulis alamat atau patokan lokasi.",
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
