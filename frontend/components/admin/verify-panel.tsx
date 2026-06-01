"use client";

import { Flag, Save, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/lib/status";
import type { ReportStatus } from "@/lib/types";

// Panel verifikasi admin — UI saja (tanpa update nyata).
export function VerifyPanel({ status }: { status: ReportStatus }) {
  const demo = () => toast.info("Demo struktur halaman — aksi belum aktif.");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Verifikasi Laporan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Ubah Status</Label>
          <Select defaultValue={status}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Catatan Admin</Label>
          <Textarea
            rows={3}
            placeholder="Tambahkan catatan untuk laporan ini…"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={demo} className="col-span-2 gap-2">
            <Save className="h-4 w-4" />
            Simpan Perubahan
          </Button>
          <Button onClick={demo} variant="outline" className="gap-2">
            <Flag className="h-4 w-4 text-primary" />
            Prioritas
          </Button>
          <Button
            onClick={demo}
            variant="outline"
            className="gap-2 border-success/40 text-[#2e7d32] hover:bg-success/10"
          >
            <Check className="h-4 w-4" />
            Validasi
          </Button>
          <Button
            onClick={demo}
            variant="outline"
            className="col-span-2 gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
            Tolak Laporan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
