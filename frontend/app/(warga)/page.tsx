import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { StatsRow } from "@/components/home/stats-row";
import { ReportCard } from "@/components/report/report-card";
import { Button } from "@/components/ui/button";
import { MOCK_REPORTS } from "@/lib/mock-data";

export default function BerandaPage() {
  const terbaru = MOCK_REPORTS.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-6 sm:py-10">
      <Hero />

      <StatsRow />

      {/* Pengganti peta: preview laporan terbaru */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              Laporan Terbaru
            </h2>
            <p className="text-sm text-muted-foreground">
              Pantau laporan jalan rusak dari warga sekitar.
            </p>
          </div>
          <Link href="/laporan">
            <Button variant="ghost" className="gap-1">
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {terbaru.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </section>
    </div>
  );
}
