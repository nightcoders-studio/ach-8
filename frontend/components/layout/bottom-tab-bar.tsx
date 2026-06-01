"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, ClipboardList, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const LONG_PRESS_MS = 350;

// Hook tekan-tahan: tap → onTap, tahan → onLongPress (tooltip), lepas → onEnd.
function useLongPress(opts: {
  onLongPress: () => void;
  onEnd: () => void;
  onTap: () => void;
}) {
  const { onLongPress, onEnd, onTap } = opts;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);

  const begin = useCallback(() => {
    longPressed.current = false;
    timer.current = setTimeout(() => {
      longPressed.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  }, [onLongPress]);

  const finish = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    onEnd();
  }, [onEnd]);

  const tap = useCallback(() => {
    if (longPressed.current) {
      longPressed.current = false;
      return; // tekan-tahan: jangan navigasi
    }
    onTap();
  }, [onTap]);

  return {
    onPointerDown: begin,
    onPointerUp: finish,
    onPointerLeave: finish,
    onPointerCancel: finish,
    onClick: tap,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
}

// Floating bottom tab bar (mobile) — 2 tab + 1 tombol tambah, sedikit glassy.
export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [tip, setTip] = useState<string | null>(null);

  return (
    <nav className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 md:hidden">
      <div className="flex w-full max-w-sm select-none items-center justify-around gap-3 rounded-full border border-border/60 bg-background/75 px-5 py-2.5 shadow-xl shadow-black/10 backdrop-blur-xl">
        <TabButton
          href="/"
          label="Beranda"
          icon={Home}
          active={pathname === "/"}
          tipOpen={tip === "home"}
          onShowTip={() => setTip("home")}
          onHideTip={() => setTip(null)}
          onNavigate={() => router.push("/")}
        />

        <CenterButton
          tipOpen={tip === "lapor"}
          onShowTip={() => setTip("lapor")}
          onHideTip={() => setTip(null)}
          onNavigate={() => router.push("/lapor")}
        />

        <TabButton
          href="/laporan"
          label="Semua Laporan"
          icon={ClipboardList}
          active={pathname.startsWith("/laporan")}
          tipOpen={tip === "laporan"}
          onShowTip={() => setTip("laporan")}
          onHideTip={() => setTip(null)}
          onNavigate={() => router.push("/laporan")}
        />
      </div>
    </nav>
  );
}

function TabButton({
  label,
  icon: Icon,
  active,
  tipOpen,
  onShowTip,
  onHideTip,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  tipOpen: boolean;
  onShowTip: () => void;
  onHideTip: () => void;
  onNavigate: () => void;
}) {
  const press = useLongPress({
    onLongPress: onShowTip,
    onEnd: onHideTip,
    onTap: onNavigate,
  });

  return (
    <div className="relative">
      {tipOpen && <Tooltip>{label}</Tooltip>}
      <button
        type="button"
        aria-label={label}
        {...press}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon className="h-7 w-7" />
      </button>
    </div>
  );
}

function CenterButton({
  tipOpen,
  onShowTip,
  onHideTip,
  onNavigate,
}: {
  tipOpen: boolean;
  onShowTip: () => void;
  onHideTip: () => void;
  onNavigate: () => void;
}) {
  const press = useLongPress({
    onLongPress: onShowTip,
    onEnd: onHideTip,
    onTap: onNavigate,
  });

  return (
    <div className="relative">
      {tipOpen && <Tooltip>Laporkan</Tooltip>}
      <button
        type="button"
        aria-label="Laporkan Jalan Rusak"
        {...press}
        className="-translate-y-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-xl shadow-primary/40 transition-transform active:scale-95"
      >
        <Plus className="h-10 w-10" />
      </button>
    </div>
  );
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md">
      {children}
      <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
    </span>
  );
}
