"use client";

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
import { WEEKLY_REPORTS } from "@/lib/mock-data";

const chartConfig = {
  laporan: { label: "Laporan", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function WeeklyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Laporan per Minggu</CardTitle>
        <CardDescription>Jumlah laporan masuk 7 hari terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart accessibilityLayer data={WEEKLY_REPORTS}>
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
