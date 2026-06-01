import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PhotoCarousel } from "@/components/report/photo-carousel";
import { StatusBadge } from "@/components/report/status-badge";
import { SeverityBadge } from "@/components/report/severity-badge";
import { StatusTimeline } from "@/components/report/status-timeline";
import { ShareButtons } from "@/components/report/share-buttons";
import { getReportById } from "@/lib/mock-data";
import { CATEGORY_LABEL } from "@/lib/status";
import { formatTanggal } from "@/lib/format";

export default async function DetailLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = getReportById(id);
  if (!report) notFound();

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
              {report.locationText}, {report.kecamatan}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatTanggal(report.created_at)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <SeverityBadge severity={report.severity} />
            <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {CATEGORY_LABEL[report.category]}
            </span>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
              Deskripsi
            </h2>
            <p className="leading-relaxed text-muted-foreground">
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
