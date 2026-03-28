"use client";

import { cn } from "@/lib/utils";

export default function ProgressBar({
  value,
  max = 100,
  className,
  color = "bg-indigo-500",
}: {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={cn("w-full bg-zinc-700 rounded-full h-2", className)}>
      <div
        className={cn("h-2 rounded-full transition-all duration-500", color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
