"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  ListChecks,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: LayoutDashboard, match: (p: string) => p === "/" },
  { href: "/criteria", label: "Criteria", icon: Target, match: (p: string) => p.startsWith("/criteria") || p === "/evidence" },
  { href: "/checklist", label: "Progress", icon: ListChecks, match: (p: string) => ["/checklist", "/timeline", "/letters"].includes(p) },
  { href: "/more", label: "More", icon: MoreHorizontal, match: (p: string) => ["/more", "/budget", "/resources", "/settings"].includes(p) },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-zinc-900 border-t border-zinc-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors active:scale-95",
                active ? "text-indigo-400" : "text-zinc-500"
              )}
            >
              <tab.icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
