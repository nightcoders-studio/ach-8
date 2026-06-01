import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Kartu statistik admin — gaya mengikuti statCards di contoh-admin.tsx.
export function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconClass: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-3 font-heading text-2xl font-bold text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
