"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/lib/status";

// Filter bar — UI saja (non-fungsional).
export function FilterBar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari lokasi atau laporan…"
          className="pl-9"
          aria-label="Cari laporan"
        />
      </div>
      <div className="flex gap-3">
        <Select>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tingkat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ringan">Ringan</SelectItem>
            <SelectItem value="sedang">Sedang</SelectItem>
            <SelectItem value="berat">Berat</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
