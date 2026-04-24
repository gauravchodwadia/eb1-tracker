"use client";

import { Eye } from "lucide-react";
import { useSelectedOwner } from "@/lib/hooks";

export default function ViewingBanner() {
  const { selectedOwner, isSelf } = useSelectedOwner();
  if (isSelf || !selectedOwner) return null;

  return (
    <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
      <Eye size={14} />
      <span>
        Viewing <span className="font-semibold">{selectedOwner}</span>&apos;s
        data (read-only)
      </span>
    </div>
  );
}
