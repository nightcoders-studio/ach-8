import { Badge } from "@/components/ui/badge";
import { SEVERITY_META } from "@/lib/status";
import type { Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity;
  className?: string;
}) {
  const meta = SEVERITY_META[severity];
  return (
    <Badge className={cn("rounded-full font-medium", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}
