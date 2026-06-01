import Link from "next/link";
import {
  FileText,
  BadgeCheck,
  Loader,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { WeeklyChart } from "@/components/admin/weekly-chart";
import { KecamatanChart } from "@/components/admin/kecamatan-chart";
import { RecentReportsTable } from "@/components/admin/recent-reports-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_REPORTS, STATS_SUMMARY } from "@/lib/mock-data";

const STAT_CARDS = [
  {
    label: "Laporan Masuk",
    value: STATS_SUMMARY.laporanMasuk,
    icon: FileText,
    iconClass: "bg-primary/10 text-primary",
  },
  {
    label: "Tervalidasi",
    value: STATS_SUMMARY.tervalidasi,
    icon: BadgeCheck,
    iconClass: "bg-success/15 text-[#2e7d32]",
  },
  {
    label: "Dalam Proses",
    value: STATS_SUMMARY.dalamProses,
    icon: Loader,
    iconClass: "bg-warning/20 text-[#8a6d00]",
  },
  {
    label: "Selesai",
    value: STATS_SUMMARY.selesai,
    icon: CheckCircle2,
    iconClass: "bg-success/15 text-[#2e7d32]",
  },
];

export default function AdminDashboardPage() {
  const belumVerifikasi = MOCK_REPORTS.filter(
    (r) => r.status === "menunggu_audit",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan laporan jalan rusak Banda Aceh.
        </p>
      </div>

      {/* Notifikasi belum diverifikasi */}
      {belumVerifikasi.length > 0 && (
        <Card className="border-warning/40 bg-warning/10">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-[#8a6d00]" />
            <p className="flex-1 text-sm text-foreground">
              <span className="font-semibold">{belumVerifikasi.length}</span>{" "}
              laporan menunggu verifikasi.
            </p>
            <Link href="/admin/laporan">
              <Button size="sm" variant="outline">
                Tinjau
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyChart />
        <KecamatanChart />
      </div>

      {/* Laporan terbaru */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Laporan Terbaru</CardTitle>
          <Link href="/admin/laporan">
            <Button variant="ghost" size="sm" className="gap-1">
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <RecentReportsTable reports={MOCK_REPORTS.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  );
}
