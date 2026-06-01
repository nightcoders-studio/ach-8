"use client";

import { useEffect, useState } from "react";
import { ReportCard } from "@/components/report/report-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getReports } from "@/lib/api";
import type { Report } from "@/lib/types";

// Preview 3 laporan terbaru di beranda (data dari backend).
export function RecentReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getReports()
      .then((data) => {
        if (active) setReports(data.slice(0, 3));
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Gagal memuat laporan terbaru.
      </p>
    );
  }

  if (reports.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada laporan. Jadilah yang pertama melapor!
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
