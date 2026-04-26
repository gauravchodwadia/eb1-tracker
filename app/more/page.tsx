"use client";

import Link from "next/link";
import { DollarSign, BookOpen, GraduationCap, Settings, ChevronRight } from "lucide-react";

const links = [
  { href: "/reviewers", label: "Reviewers", icon: GraduationCap },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MorePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">More</h1>
        <p className="text-zinc-400 mt-1">Additional tools and settings</p>
      </div>

      <div className="space-y-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-zinc-800/80 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
              <Icon size={20} className="text-zinc-400 group-hover:text-indigo-400 transition-colors" />
            </div>
            <span className="flex-1 text-lg font-medium text-white">{label}</span>
            <ChevronRight size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
