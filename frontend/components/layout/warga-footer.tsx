import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function WargaFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Laporkan. Perbaiki. Bangun Kota Bersama. Platform pelaporan jalan
            rusak untuk warga.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Beranda
          </Link>
          <Link href="/laporan" className="hover:text-primary">
            Semua Laporan
          </Link>
          <Link href="/lapor" className="hover:text-primary">
            Lapor
          </Link>
          <Link href="/admin/login" className="hover:text-primary">
            Admin
          </Link>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fix-In. Dibuat untuk hackathon.
      </div>
    </footer>
  );
}
