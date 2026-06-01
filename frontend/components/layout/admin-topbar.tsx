"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { clearToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminNav } from "./admin-nav";

export function AdminTopbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleLogout() {
    clearToken();
    toast.success("Berhasil keluar.");
    router.replace("/admin/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon" className="lg:hidden" />
          }
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Buka menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menu Admin</SheetTitle>
          <AdminNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground sm:flex">
        <CalendarDays className="h-4 w-4" />
        18 Mei – 24 Mei 2024
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-sm leading-tight sm:block">
            <p className="font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">Dinas PU</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Keluar"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
