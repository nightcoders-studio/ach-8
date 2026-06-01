"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/lib/status";
import type { ReportStatus } from "@/lib/types";
import { updateReportStatus } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

// Panel verifikasi admin — mengubah status laporan via backend (butuh login).
export function VerifyPanel({
  reportId,
  status,
  onUpdated,
}: {
  reportId: string;
  status: ReportStatus;
  onUpdated?: (status: ReportStatus) => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<ReportStatus>(status);
  const [saving, setSaving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // Kirim perubahan status ke backend; kembalikan true bila sukses.
  async function applyStatus(next: ReportStatus): Promise<boolean> {
    const token = getToken();
    if (!token) {
      toast.error("Sesi habis. Silakan login kembali.");
      router.replace("/admin/login");
      return false;
    }
    try {
      await updateReportStatus(reportId, next, token);
      onUpdated?.(next);
      return true;
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        clearToken();
        toast.error("Sesi habis. Silakan login kembali.");
        router.replace("/admin/login");
      } else {
        toast.error(err instanceof Error ? err.message : "Gagal mengubah status");
      }
      return false;
    }
  }

  async function handleSave() {
    if (selected === status) {
      toast.info("Status tidak berubah.");
      return;
    }
    setSaving(true);
    if (await applyStatus(selected)) {
      toast.success("Status laporan berhasil diperbarui.");
    }
    setSaving(false);
  }

  async function handleReject() {
    if (status === "ditolak") {
      toast.info("Laporan sudah ditolak.");
      return;
    }
    setRejecting(true);
    if (await applyStatus("ditolak")) {
      setSelected("ditolak");
      toast.success("Laporan ditolak.");
    }
    setRejecting(false);
  }

  const busy = saving || rejecting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Verifikasi Laporan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Ubah Status</Label>
          <Select
            value={selected}
            onValueChange={(v) => setSelected(v as ReportStatus)}
          >
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

        <Button onClick={handleSave} disabled={busy} className="w-full gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Menyimpan…" : "Simpan Perubahan"}
        </Button>

        <Button
          onClick={handleReject}
          disabled={busy || status === "ditolak"}
          variant="outline"
          className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          {rejecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
          {status === "ditolak" ? "Sudah Ditolak" : "Tolak Laporan"}
        </Button>
      </CardContent>
    </Card>
  );
}
