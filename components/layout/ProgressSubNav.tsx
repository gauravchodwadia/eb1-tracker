"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/checklist", label: "Checklist" },
  { href: "/timeline", label: "Timeline" },
  { href: "/letters", label: "Letters" },
];

export default function ProgressSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            pathname === tab.href
              ? "bg-indigo-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
