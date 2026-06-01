"use client";

import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Report } from "@/lib/types";

const chartConfig = {
  jumlah: { label: "Laporan" },
} satisfies ChartConfig;

const FILLS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Donut "Laporan per Kecamatan" — sebaran wilayah laporan (data nyata).
export function KecamatanChart({ reports }: { reports: Report[] }) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of reports) {
      const key = r.kecamatan || "Lainnya";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([kecamatan, jumlah], i) => ({
        kecamatan,
        jumlah,
        fill: FILLS[i % FILLS.length],
      }));
  }, [reports]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Laporan per Kecamatan</CardTitle>
        <CardDescription>Sebaran wilayah laporan</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
        {data.length === 0 ? (
          <p className="py-8 text-sm text-muted-foreground">
            Belum ada data laporan.
          </p>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-[180px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="kecamatan" />}
                />
                <Pie
                  data={data}
                  dataKey="jumlah"
                  nameKey="kecamatan"
                  innerRadius={45}
                  strokeWidth={4}
                />
              </PieChart>
            </ChartContainer>
            <ul className="flex-1 space-y-2 self-stretch">
              {data.map((k) => (
                <li
                  key={k.kecamatan}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span
                    className="h-3 w-3 rounded-sm"
                    style={{ background: k.fill }}
                  />
                  <span className="flex-1 text-foreground">{k.kecamatan}</span>
                  <span className="font-medium">{k.jumlah}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
