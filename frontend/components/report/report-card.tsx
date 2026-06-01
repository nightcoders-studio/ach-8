import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { SeverityBadge } from "./severity-badge";
import { CATEGORY_LABEL } from "@/lib/status";
import { formatTanggalSingkat } from "@/lib/format";
import type { Report } from "@/lib/types";

// Kartu laporan bergaya GrabFood/Medium — dipakai di beranda & daftar laporan.
export function ReportCard({ report }: { report: Report }) {
  return (
    <Link href={`/laporan/${report.id}`} className="group block">
      <Card className="overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
          <Image
            src={report.photo_url}
            alt={report.locationText}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={report.status} />
          </div>
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-heading font-semibold text-foreground">
              {report.locationText}
            </h3>
            <SeverityBadge severity={report.severity} />
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {report.description}
          </p>
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {report.kecamatan}
            </span>
            <span>{formatTanggalSingkat(report.created_at)}</span>
          </div>
          <p className="text-xs font-medium text-muted-foreground/80">
            {CATEGORY_LABEL[report.category]}
          </p>
        </div>
      </Card>
    </Link>
  );
}
