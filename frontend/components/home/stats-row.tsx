import { FileText, BadgeCheck, Loader } from "lucide-react";
import { Card } from "@/components/ui/card";
import { STATS_SUMMARY } from "@/lib/mock-data";

const ITEMS = [
  {
    label: "Laporan Masuk",
    value: STATS_SUMMARY.laporanMasuk,
    icon: FileText,
    tint: "bg-primary/10 text-primary",
  },
  {
    label: "Tervalidasi",
    value: STATS_SUMMARY.tervalidasi,
    icon: BadgeCheck,
    tint: "bg-success/15 text-[#2e7d32]",
  },
  {
    label: "Dalam Proses",
    value: STATS_SUMMARY.dalamProses,
    icon: Loader,
    tint: "bg-warning/20 text-[#8a6d00]",
  },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {ITEMS.map((item) => (
        <Card key={item.label} className="p-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.tint}`}
          >
            <item.icon className="h-5 w-5" />
          </div>
          <p className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {item.value}
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {item.label}
          </p>
        </Card>
      ))}
    </div>
  );
}
