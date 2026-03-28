"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Target,
  GraduationCap,
  FileText,
  Mail,
  CheckSquare,
  Clock,
  DollarSign,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/criteria", label: "Criteria", icon: Target },
  { href: "/reviewers", label: "Reviewers", icon: GraduationCap },
  { href: "/evidence", label: "Evidence", icon: FileText },
  { href: "/letters", label: "Letters", icon: Mail },
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/resources", label: "Resources", icon: BookOpen },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="hidden lg:flex w-60 bg-zinc-900 border-r border-zinc-700/50 flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-zinc-700/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            EB
          </div>
          <span className="font-semibold text-white text-lg">EB-1A Tracker</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
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
        ))}
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
