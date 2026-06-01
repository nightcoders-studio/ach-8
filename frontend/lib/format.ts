// Util format tanggal Indonesia (UI-only).

export function formatTanggal(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatTanggalSingkat(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatRelatif(iso: string): string {
  try {
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const menit = Math.floor(diffMs / 60000);
    const jam = Math.floor(menit / 60);
    const hari = Math.floor(jam / 24);
    if (menit < 1) return "baru saja";
    if (menit < 60) return `${menit} menit lalu`;
    if (jam < 24) return `${jam} jam lalu`;
    if (hari < 7) return `${hari} hari lalu`;
    return formatTanggalSingkat(iso);
  } catch {
    return iso;
  }
}
