import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/report/status-badge";
import { SeverityBadge } from "@/components/report/severity-badge";
import { StatusTimeline } from "@/components/report/status-timeline";
import { VerifyPanel } from "@/components/admin/verify-panel";
import { getReportById } from "@/lib/mock-data";
import { CATEGORY_LABEL } from "@/lib/status";
import { formatTanggal } from "@/lib/format";

export default async function AdminVerifikasiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = getReportById(id);
  if (!report) notFound();

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
                    {report.locationText}, {report.kecamatan}
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
                <Field label="Kategori">
                  {CATEGORY_LABEL[report.category]}
                </Field>
              </dl>
              <Separator />
              <div>
                <dt className="mb-1 text-sm font-medium text-muted-foreground">
                  Deskripsi
                </dt>
                <dd className="leading-relaxed text-foreground">
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
            <VerifyPanel status={report.status} />
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
