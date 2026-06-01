"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FilterBar } from "@/components/report/filter-bar";
import { RecentReportsTable } from "@/components/admin/recent-reports-table";
import { Card, CardContent } from "@/components/ui/card";
import { getReports } from "@/lib/api";
import type { Report } from "@/lib/types";

export default function AdminLaporanPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getReports()
      .then((data) => active && setReports(data))
      .catch(
        (err) =>
          active &&
          setError(err instanceof Error ? err.message : "Gagal memuat laporan"),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Kelola Laporan
        </h1>
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Memuat laporan…"
            : `${reports.length} laporan masuk. Klik ikon mata untuk verifikasi.`}
        </p>
      </div>

      <FilterBar />

      <Card>
        <CardContent className="p-0 sm:p-2">
          {error ? (
            <p className="p-6 text-center text-destructive">{error}</p>
          ) : loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Memuat…
            </div>
          ) : reports.length > 0 ? (
            <RecentReportsTable reports={reports} />
          ) : (
            <p className="p-6 text-center text-muted-foreground">
              Belum ada laporan masuk.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
