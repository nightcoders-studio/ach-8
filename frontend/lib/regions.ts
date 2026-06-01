// Data wilayah (mock) untuk dropdown form lapor — kecamatan → desa/gampong (Banda Aceh).
export const KECAMATAN_DESA: Record<string, string[]> = {
  "Kuta Alam": ["Peunayong", "Bandar Baru", "Lampulo", "Mulia"],
  "Baiturrahman": ["Neusu", "Seutui", "Ateuk Pahlawan", "Sukaramai"],
  "Syiah Kuala": ["Lamgugob", "Kopelma Darussalam", "Rukoh", "Jeulingke"],
  "Meuraxa": ["Ulee Lheue", "Punge Jurong", "Blang Oi", "Deah Glumpang"],
  "Lueng Bata": ["Lamseupeung", "Batoh", "Lampaloh", "Cot Mesjid"],
};

export const KECAMATAN_OPTIONS = Object.keys(KECAMATAN_DESA);
