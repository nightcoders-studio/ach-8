import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "@/lib/status";
import type { ReportStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: ReportStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <Badge className={cn("rounded-full font-medium", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}
