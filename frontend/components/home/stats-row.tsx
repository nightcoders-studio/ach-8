"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Loader, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getReports } from "@/lib/api";
import type { Report } from "@/lib/types";

// Ringkasan statistik beranda dari data laporan nyata.
export function StatsRow() {
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

  const items = useMemo(() => {
    const count = (s: Report["status"]) =>
      reports.filter((r) => r.status === s).length;
    return [
      {
        label: "Laporan Masuk",
        value: reports.length,
        icon: FileText,
        tint: "bg-primary/10 text-primary",
      },
      {
        label: "Dalam Proses",
        value: count("diperbaiki"),
        icon: Loader,
        tint: "bg-warning/20 text-[#8a6d00]",
      },
      {
        label: "Selesai",
        value: count("selesai"),
        icon: CheckCircle2,
        tint: "bg-success/15 text-[#2e7d32]",
      },
    ];
  }, [reports]);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {items.map((item) => (
        <Card key={item.label} className="p-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.tint}`}
          >
            <item.icon className="h-5 w-5" />
          </div>
          <p className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {item.value}
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {item.label}
          </p>
        </Card>
      ))}
    </div>
  );
}
