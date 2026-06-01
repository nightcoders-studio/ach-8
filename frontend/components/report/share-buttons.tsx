"use client";

import { Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Tombol share — UI saja (belum ada aksi nyata).
export function ShareButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="gap-2">
        <Share2 className="h-4 w-4 text-[#25D366]" />
        Bagikan ke WhatsApp
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <Link2 className="h-4 w-4" />
        Salin Tautan
      </Button>
    </div>
  );
}
