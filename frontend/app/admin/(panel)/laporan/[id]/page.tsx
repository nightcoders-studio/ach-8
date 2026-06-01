"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/report/status-badge";
import { SeverityBadge } from "@/components/report/severity-badge";
import { StatusTimeline } from "@/components/report/status-timeline";
import { VerifyPanel } from "@/components/admin/verify-panel";
import { getReportById } from "@/lib/api";
import { formatTanggal } from "@/lib/format";
import type { Report, ReportStatus } from "@/lib/types";

export default function AdminVerifikasiPage({
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
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Laporan tidak ditemukan.</p>
        <Link
          href="/admin/laporan"
          className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Link>
      </div>
    );
  }

  const handleUpdated = (status: ReportStatus) =>
    setReport((prev) => (prev ? { ...prev, status } : prev));

  return (
    <div className="space-y-6">
      <Link
        href="/admin/laporan"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Data laporan */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden p-0">
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {report.photos.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden bg-secondary"
                >
                  <Image
                    src={src}
                    alt={`${report.locationText} — foto ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Laporan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field label="Lokasi">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {report.locationText}
                  </span>
                </Field>
                <Field label="Tanggal">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    {formatTanggal(report.created_at)}
                  </span>
                </Field>
                <Field label="Tingkat Kerusakan">
                  <SeverityBadge severity={report.severity} />
                </Field>
                <Field label="Titik Lokasi (GPS)">
                  <a
                    href={`https://www.google.com/maps/search/${report.latitude},+${report.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Navigation className="h-3.5 w-3.5 text-primary" />
                      Buka Google Maps
                    </Button>
                  </a>
                </Field>
              </dl>
              <Separator />
              <div>
                <dt className="mb-1 text-sm font-medium text-muted-foreground">
                  Deskripsi
                </dt>
                <dd className="whitespace-pre-line leading-relaxed text-foreground">
                  {report.description}
                </dd>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline
                status={report.status}
                createdAt={report.created_at}
              />
            </CardContent>
          </Card>
        </div>

        {/* Panel verifikasi */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <VerifyPanel
              reportId={report.id}
              status={report.status}
              onUpdated={handleUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="mb-1 text-sm font-medium text-muted-foreground">
        {label}
      </dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}
