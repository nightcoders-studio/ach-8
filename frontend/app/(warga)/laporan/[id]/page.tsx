"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoCarousel } from "@/components/report/photo-carousel";
import { StatusBadge } from "@/components/report/status-badge";
import { SeverityBadge } from "@/components/report/severity-badge";
import { StatusTimeline } from "@/components/report/status-timeline";
import { ShareButtons } from "@/components/report/share-buttons";
import { getReportById } from "@/lib/api";
import { formatTanggal } from "@/lib/format";
import type { Report } from "@/lib/types";

export default function DetailLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getReportById(id)
      .then((r) => active && setReport(r))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 sm:py-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Laporan tidak ditemukan.</p>
        <Link
          href="/laporan"
          className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <Link
        href="/laporan"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar
      </Link>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {report.code}
          </p>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {report.locationText}
          </h1>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <PhotoCarousel photos={report.photos} alt={report.locationText} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Konten utama */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              {report.locationText}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatTanggal(report.created_at)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <SeverityBadge severity={report.severity} />
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
              Deskripsi
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {report.description}
            </p>
          </div>

          <Separator />

          <ShareButtons />
        </div>

        {/* Kartu samping sticky */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle className="text-lg">Status Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline
                status={report.status}
                createdAt={report.created_at}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
