import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/report/status-badge";
import { SeverityBadge } from "@/components/report/severity-badge";
import { formatTanggalSingkat } from "@/lib/format";
import type { Report } from "@/lib/types";

// Tabel laporan terbaru — gaya mengikuti tabel "Recent Messages" di contoh-admin.tsx.
export function RecentReportsTable({ reports }: { reports: Report[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Laporan</TableHead>
            <TableHead className="hidden md:table-cell">Tingkat</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={r.photo_url}
                      alt={r.locationText}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {r.locationText}
                    </p>
                    <p className="text-xs text-muted-foreground">{r.code}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <SeverityBadge severity={r.severity} />
              </TableCell>
              <TableCell>
                <StatusBadge status={r.status} />
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                {formatTanggalSingkat(r.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/laporan/${r.id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Lihat laporan</span>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
