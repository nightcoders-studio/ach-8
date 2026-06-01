import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { SeverityBadge } from "./severity-badge";
import { formatTanggalSingkat } from "@/lib/format";
import type { Report } from "@/lib/types";

// Baris laporan bergaya mockup "Semua Laporan".
export function ReportListItem({ report }: { report: Report }) {
  return (
    <Link
      href={`/laporan/${report.id}`}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/40"
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
        <Image
          src={report.photo_url}
          alt={report.locationText}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-medium text-foreground">
            {report.locationText}
          </h3>
          <SeverityBadge severity={report.severity} />
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
          {report.description}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-primary" />
            {report.kecamatan}
          </span>
          <span>{formatTanggalSingkat(report.created_at)}</span>
          <StatusBadge status={report.status} className="ml-auto sm:ml-0" />
        </div>
      </div>
      <ChevronRight className="hidden h-5 w-5 flex-shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 sm:block" />
    </Link>
  );
}
