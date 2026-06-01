"use client";

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
import { KECAMATAN_DISTRIBUTION } from "@/lib/mock-data";

const chartConfig = {
  jumlah: { label: "Laporan" },
} satisfies ChartConfig;

// Donut "Laporan per Kecamatan" — pengganti peta di dashboard.
export function KecamatanChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Laporan per Kecamatan</CardTitle>
        <CardDescription>Sebaran wilayah laporan</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-[180px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="kecamatan" />} />
            <Pie
              data={KECAMATAN_DISTRIBUTION}
              dataKey="jumlah"
              nameKey="kecamatan"
              innerRadius={45}
              strokeWidth={4}
            />
          </PieChart>
        </ChartContainer>
        <ul className="flex-1 space-y-2 self-stretch">
          {KECAMATAN_DISTRIBUTION.map((k) => (
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
      </CardContent>
    </Card>
  );
}
