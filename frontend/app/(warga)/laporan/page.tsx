import { LaporanExplorer } from "@/components/report/laporan-explorer";
import { MOCK_REPORTS } from "@/lib/mock-data";

export default function DaftarLaporanPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:py-10">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Semua Laporan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Telusuri laporan jalan rusak dari warga.
        </p>
      </div>

      <LaporanExplorer reports={MOCK_REPORTS} />
    </div>
  );
}
