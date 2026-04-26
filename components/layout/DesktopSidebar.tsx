"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useData } from "@/lib/hooks";
import type { CriteriaData, CriterionStatus } from "@/lib/types";
import {
  LayoutDashboard,
  Target,
  FileText,
  Mail,
  CheckSquare,
  Clock,
  DollarSign,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import ProfileSwitcher from "./ProfileSwitcher";

const CRITERION_SHORT_LABELS: Record<number, string> = {
  1: "Awards",
  2: "Memberships",
  3: "Media",
  4: "Judging",
  5: "Contributions",
  6: "Publications",
  7: "Exhibitions",
  8: "Critical Role",
  9: "High Salary",
  10: "Performing Arts",
};

function statusDotColor(status: CriterionStatus): string {
  switch (status) {
    case "strong":
      return "bg-emerald-500";
    case "researching":
    case "evidence_gathering":
      return "bg-amber-500";
    case "weak":
      return "bg-red-500";
    case "not_applicable":
      return "bg-zinc-600";
    default:
      return "bg-zinc-700";
  }
}

const NAV_ITEMS_TOP = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/criteria", label: "Criteria", icon: Target },
];

const NAV_ITEMS_MIDDLE = [
  { href: "/evidence", label: "Evidence", icon: FileText },
  { href: "/letters", label: "Letters", icon: Mail },
];

const NAV_ITEMS_BOTTOM = [
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/resources", label: "Resources", icon: BookOpen },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: criteria } = useData<CriteriaData>("criteria");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const targetedCriteria = criteria
    ? criteria.filter((c) => c.targeted).sort((a, b) => b.strengthScore - a.strengthScore)
    : [];

  const renderNavItem = (item: { href: string; label: string; icon: React.ComponentType<{ size?: number }> }) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        isActive(item.href)
          ? "bg-indigo-600/20 text-indigo-400"
          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
      )}
    >
      <item.icon size={18} />
      {item.label}
    </Link>
  );

  return (
    <aside className="hidden lg:flex w-60 bg-zinc-900 border-r border-zinc-700/50 flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-zinc-700/50 space-y-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            EB
          </div>
          <span className="font-semibold text-white text-lg">EB-1A Tracker</span>
        </Link>
        <Suspense fallback={null}>
          <ProfileSwitcher />
        </Suspense>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS_TOP.map(renderNavItem)}

        {/* Targeted criteria sub-items */}
        {targetedCriteria.length > 0 && (
          <div className="space-y-0.5 pl-4">
            {targetedCriteria.map((c) => {
              const href = `/criteria/${c.id}`;
              const active = pathname === href;
              return (
                <Link
                  key={c.id}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    active
                      ? "bg-indigo-600/20 text-indigo-400"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full shrink-0", statusDotColor(c.status))} />
                  {CRITERION_SHORT_LABELS[c.id] || c.title}
                </Link>
              );
            })}
          </div>
        )}

        {NAV_ITEMS_MIDDLE.map(renderNavItem)}

        {/* Divider */}
        <div className="border-t border-zinc-700/50 my-2" />

        {NAV_ITEMS_BOTTOM.map(renderNavItem)}
      </nav>

      <div className="px-3 py-4 border-t border-zinc-700/50 space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive("/settings")
              ? "bg-indigo-600/20 text-indigo-400"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          )}
        >
          <Settings size={18} />
          Settings
        </Link>

        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-2">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt=""
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-300 truncate">
                {session.user.name || session.username}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
