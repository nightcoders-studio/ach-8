import Link from "next/link";
import {
  ArrowRight,
  Camera,
  MapPin,
  Activity,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ONBOARDING_FEATURES } from "@/lib/mock-data";

const ICONS: Record<string, LucideIcon> = {
  camera: Camera,
  "map-pin": MapPin,
  activity: Activity,
  users: Users,
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-secondary/60 to-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
        <Logo className="mx-auto" textClassName="text-2xl" />

        <div className="mt-10 text-center">
          <h1 className="font-heading text-3xl font-extrabold leading-tight text-foreground">
            Laporkan.{" "}
            <span className="text-primary">Perbaiki.</span>
            <br />
            Bangun Kota Bersama.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Satu laporan dari kamu, satu langkah perbaikan untuk jalan Banda
            Aceh.
          </p>
        </div>

        <ul className="mt-10 space-y-3">
          {ONBOARDING_FEATURES.map((f) => {
            const Icon = ICONS[f.icon];
            return (
              <li
                key={f.title}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium text-foreground">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-10">
          <Link href="/">
            <Button size="lg" className="w-full gap-2">
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            href="/laporan"
            className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary"
          >
            Lihat laporan dulu
          </Link>
        </div>
      </div>
    </div>
  );
}
