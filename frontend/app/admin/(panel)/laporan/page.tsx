"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Loader2, Search } from "lucide-react";
import { RecentReportsTable } from "@/components/admin/recent-reports-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SEVERITY_RANK } from "@/lib/status";
import { getReports } from "@/lib/api";
import type { Report } from "@/lib/types";

type SortKey = "terbaru" | "terlama" | "berat" | "ringan";

const ALL = "all";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "terbaru", label: "Terbaru" },
  { value: "terlama", label: "Terlama" },
  { value: "berat", label: "Paling Berat" },
  { value: "ringan", label: "Paling Ringan" },
];

export default function AdminLaporanPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [kecamatan, setKecamatan] = useState<string>(ALL);
  const [desa, setDesa] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("terbaru");

  useEffect(() => {
    let active = true;
    getReports()
      .then((data) => active && setReports(data))
      .catch(
        (err) =>
          active &&
          setError(err instanceof Error ? err.message : "Gagal memuat laporan"),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const kecamatanList = useMemo(
    () => Array.from(new Set(reports.map((r) => r.kecamatan))).sort(),
    [reports],
  );

  const desaList = useMemo(() => {
    const base =
      kecamatan === ALL
        ? reports
        : reports.filter((r) => r.kecamatan === kecamatan);
    return Array.from(new Set(base.map((r) => r.desa).filter(Boolean))).sort();
  }, [reports, kecamatan]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = reports.filter((r) => {
      if (kecamatan !== ALL && r.kecamatan !== kecamatan) return false;
      if (desa !== ALL && r.desa !== desa) return false;
      if (term) {
        return (
          r.locationText.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          r.kecamatan.toLowerCase().includes(term) ||
          r.desa.toLowerCase().includes(term)
        );
      }
      return true;
    });

    return list.sort((a, b) => {
      switch (sort) {
        case "terbaru":
          return +new Date(b.created_at) - +new Date(a.created_at);
        case "terlama":
          return +new Date(a.created_at) - +new Date(b.created_at);
        case "berat":
          return SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
        case "ringan":
          return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
        default:
          return 0;
      }
    });
  }, [reports, q, kecamatan, desa, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Kelola Laporan
        </h1>
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Memuat laporan…"
            : `${results.length} dari ${reports.length} laporan. Klik ikon mata untuk verifikasi.`}
        </p>
      </div>

      {/* Filter & urutkan — sama seperti daftar laporan warga */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari lokasi atau laporan…"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Select
            value={kecamatan}
            onValueChange={(v) => {
              setKecamatan((v as string) ?? ALL);
              setDesa(ALL);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua Kecamatan</SelectItem>
              {kecamatanList.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={desa} onValueChange={(v) => setDesa((v as string) ?? ALL)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Desa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua Desa</SelectItem>
              {desaList.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="col-span-2 w-full sm:col-span-1">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-2">
          {error ? (
            <p className="p-6 text-center text-destructive">{error}</p>
          ) : loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Memuat…
            </div>
          ) : results.length > 0 ? (
            <RecentReportsTable reports={results} />
          ) : (
            <p className="p-6 text-center text-muted-foreground">
              Tidak ada laporan yang cocok dengan filter.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
