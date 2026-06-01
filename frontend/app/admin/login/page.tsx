import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo textClassName="text-2xl" />
          <p className="mt-3 text-sm text-muted-foreground">
            Masuk ke panel admin Fix-In
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@fixin.id"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <Link href="/admin" className="block">
              <Button className="w-full">Masuk</Button>
            </Link>
          </CardContent>
        </Card>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-muted-foreground hover:text-primary"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
