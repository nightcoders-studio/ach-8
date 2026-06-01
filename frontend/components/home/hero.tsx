import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#263238] to-[#37474f] px-6 py-10 text-white sm:px-10 sm:py-14">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative max-w-xl">
        <p className="text-sm font-medium text-primary-foreground/80">
          Selamat datang 👋
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
          Bantu perbaiki jalan{" "}
          <span className="text-primary">Banda Aceh</span>
        </h1>
        <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">
          Laporkan. Perbaiki. Bangun Kota Bersama. Foto jalan rusak di sekitarmu
          dan kirim laporan dalam satu menit.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/lapor">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Laporkan Jalan Rusak
            </Button>
          </Link>
          <Link href="/laporan">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              Lihat Semua Laporan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
