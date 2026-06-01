"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  laporan: { label: "Laporan", color: "var(--chart-1)" },
} satisfies ChartConfig;

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// "Laporan per Minggu" — jumlah laporan masuk 7 hari terakhir (data nyata).
export function WeeklyChart({ reports }: { reports: Report[] }) {
  const data = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Siapkan 7 hari terakhir (hari ini di paling kanan).
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return { date: d, day: HARI[d.getDay()], laporan: 0 };
    });

    for (const r of reports) {
      const created = new Date(r.created_at);
      created.setHours(0, 0, 0, 0);
      const bucket = days.find((d) => d.date.getTime() === created.getTime());
      if (bucket) bucket.laporan += 1;
    }

    return days.map(({ day, laporan }) => ({ day, laporan }));
  }, [reports]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Laporan per Minggu</CardTitle>
        <CardDescription>Jumlah laporan masuk 7 hari terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="laporan" fill="var(--color-laporan)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
