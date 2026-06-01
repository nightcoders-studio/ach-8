import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  textClassName,
  showText = true,
}: {
  className?: string;
  textClassName?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <MapPin className="h-5 w-5" fill="currentColor" strokeWidth={1.5} />
      </span>
      {showText && (
        <span
          className={cn(
            "font-heading text-xl font-extrabold tracking-tight text-foreground",
            textClassName,
          )}
        >
          Fix-In
        </span>
      )}
    </span>
  );
}
