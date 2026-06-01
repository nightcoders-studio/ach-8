import { Check, XCircle } from "lucide-react";
import { STATUS_TIMELINE_INDEX, TIMELINE_STEPS } from "@/lib/status";
import type { ReportStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatTanggalSingkat } from "@/lib/format";

// Timeline tahap (visual). reachedIndex diturunkan dari status backend.
export function StatusTimeline({
  status,
  createdAt,
}: {
  status: ReportStatus;
  createdAt: string;
}) {
  const reached = STATUS_TIMELINE_INDEX[status];

  // Laporan ditolak: tampilkan status khusus, bukan timeline normal.
  if (status === "ditolak") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive">
        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">Laporan Ditolak</p>
          <p className="text-xs opacity-80">{formatTanggalSingkat(createdAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <ol className="relative space-y-0">
      {TIMELINE_STEPS.map((step, i) => {
        const done = i <= reached;
        const isLast = i === TIMELINE_STEPS.length - 1;
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs",
                  done
                    ? "border-success bg-success text-success-foreground"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              {!isLast && (
                <span
                  className={cn(
                    "min-h-8 w-0.5 flex-1",
                    i < reached ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step}
              </p>
              {done && (
                <p className="text-xs text-muted-foreground">
                  {formatTanggalSingkat(createdAt)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
