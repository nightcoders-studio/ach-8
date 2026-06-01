"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, BadgeCheck, LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export const ADMIN_NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    // aktif hanya tepat di /admin
    match: (p: string) => p === "/admin",
  },
  {
    href: "/admin/laporan",
    label: "Laporan",
    icon: FileText,
    // aktif hanya di daftar laporan, bukan halaman detail
    match: (p: string) => p === "/admin/laporan",
  },
  {
    href: "/admin/laporan/1",
    label: "Verifikasi",
    icon: BadgeCheck,
    // aktif di halaman detail/verifikasi laporan
    match: (p: string) => p.startsWith("/admin/laporan/"),
  },
];

// Isi navigasi admin (dipakai sidebar desktop & drawer mobile).
export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {ADMIN_NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link
          href="/admin/login"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </Link>
      </div>
    </div>
  );
}
