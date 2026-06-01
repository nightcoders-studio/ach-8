"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportCard } from "./report-card";
import { SEVERITY_RANK } from "@/lib/status";
import { getReports } from "@/lib/api";
import type { Report } from "@/lib/types";

type SortKey = "terbaru" | "terlama" | "berat" | "ringan";

const ALL = "all";
const PAGE_SIZE = 6; // jumlah laporan yang dimuat tiap "halaman" lazy load.

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "terbaru", label: "Terbaru" },
  { value: "terlama", label: "Terlama" },
  { value: "berat", label: "Paling Berat" },
  { value: "ringan", label: "Paling Ringan" },
];

// Daftar laporan: fetch semua dari backend, filter/urut client-side,
// lalu render bertahap (lazy loading / infinite scroll).
export function LaporanExplorer() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [kecamatan, setKecamatan] = useState<string>(ALL);
  const [desa, setDesa] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("terbaru");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getReports()
      .then((data) => {
        if (active) setReports(data);
      })
      .catch((err) => {
        if (active)
          setError(err instanceof Error ? err.message : "Gagal memuat laporan");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
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

  // Reset jumlah yang tampil saat filter/urutan berubah.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q, kecamatan, desa, sort]);

  const shown = results.slice(0, visible);
  const hasMore = visible < results.length;

  // Infinite scroll: tambah PAGE_SIZE saat sentinel terlihat.
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => v + PAGE_SIZE);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, shown.length]);

  return (
    <div className="space-y-5">
      {/* Kontrol filter & urutkan */}
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

      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 py-16 text-center text-destructive">
          {error}
        </div>
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {results.length} laporan ditemukan
          </p>

          {results.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>

              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memuat laporan lainnya…
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
              Tidak ada laporan yang cocok dengan filter.
            </div>
          )}
        </>
      )}
    </div>
  );
}
