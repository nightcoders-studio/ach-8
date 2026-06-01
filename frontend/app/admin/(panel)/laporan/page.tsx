import { FilterBar } from "@/components/report/filter-bar";
import { RecentReportsTable } from "@/components/admin/recent-reports-table";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_REPORTS } from "@/lib/mock-data";

export default function AdminLaporanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Kelola Laporan
        </h1>
        <p className="text-sm text-muted-foreground">
          {MOCK_REPORTS.length} laporan masuk. Klik ikon mata untuk verifikasi.
        </p>
      </div>

      <FilterBar />

      <Card>
        <CardContent className="p-0 sm:p-2">
          <RecentReportsTable reports={MOCK_REPORTS} />
        </CardContent>
      </Card>
    </div>
  );
}
