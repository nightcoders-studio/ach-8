"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
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
import { Skeleton } from "@/components/ui/skeleton";
import { getReports } from "@/lib/api";
import type { Report } from "@/lib/types";

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getReports()
      .then((data) => active && setReports(data))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const count = (s: Report["status"]) =>
      reports.filter((r) => r.status === s).length;
    return {
      total: reports.length,
      menunggu: count("menunggu_audit"),
      diperbaiki: count("diperbaiki"),
      selesai: count("selesai"),
    };
  }, [reports]);

  const belumVerifikasi = reports.filter((r) => r.status === "menunggu_audit");

  const statCards = [
    {
      label: "Laporan Masuk",
      value: stats.total,
      icon: FileText,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Menunggu Audit",
      value: stats.menunggu,
      icon: Clock,
      iconClass: "bg-secondary text-muted-foreground",
    },
    {
      label: "Dalam Proses",
      value: stats.diperbaiki,
      icon: Loader,
      iconClass: "bg-warning/20 text-[#8a6d00]",
    },
    {
      label: "Selesai",
      value: stats.selesai,
      icon: CheckCircle2,
      iconClass: "bg-success/15 text-[#2e7d32]",
    },
  ];

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
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))
          : statCards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Charts (data nyata dari laporan) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyChart reports={reports} />
        <KecamatanChart reports={reports} />
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
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            // 5 laporan terbaru, disusun dari bawah ke atas (terbaru di bawah).
            <RecentReportsTable reports={reports.slice(0, 5).reverse()} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
