"use client";

import { useState } from "react";
import { useData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import ProgressSubNav from "@/components/layout/ProgressSubNav";
import type { ChecklistData, ChecklistSection } from "@/lib/types";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";

export default function ChecklistPage() {
  const { data: checklist, loading } = useData<ChecklistData>("checklist");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (loading || !checklist) {
    return (
      <>
        <ProgressSubNav />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
        </div>
      </>
    );
  }

  const total = checklist.reduce((acc, s) => acc + s.items.length, 0);
  const checked = checklist.reduce(
    (acc, s) => acc + s.items.filter((i) => i.checked).length,
    0
  );
  const completedSections = checklist.filter(
    (s) => s.items.length > 0 && s.items.every((i) => i.checked)
  ).length;

  function toggle(id: string) {
    setCollapsed((p) => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProgressSubNav />

      <div className="border-b border-zinc-800 pb-6 mb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Master checklist
        </h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm tabular-nums">
          <span>
            <span className="font-medium text-zinc-200">{checked}</span>{" "}
            <span className="text-zinc-500">of {total} items</span>
          </span>
          <span>
            <span className="font-medium text-emerald-300">{completedSections}</span>{" "}
            <span className="text-zinc-500">of {checklist.length} sections complete</span>
          </span>
        </div>
        <div className="mt-4 h-1 w-full bg-zinc-800/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-400 rounded-full transition-all"
            style={{ width: `${total > 0 ? Math.max(2, (checked / total) * 100) : 0}%` }}
          />
        </div>
      </div>

      {checklist.length === 0 ? (
        <EmptyState
          title="No checklist items yet"
          description="Sections will appear here once your data repo has them."
        />
      ) : (
        <div>
          {checklist.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              isCollapsed={collapsed[section.id] ?? false}
              onToggle={() => toggle(section.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  section,
  isCollapsed,
  onToggle,
}: {
  section: ChecklistSection;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const done = section.items.filter((i) => i.checked).length;
  const totalItems = section.items.length;
  const isComplete = done === totalItems && totalItems > 0;

  return (
    <section className="mb-6 last:mb-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm flex items-baseline justify-between border-b border-zinc-800/70 py-2 mb-1 hover:bg-zinc-900/40 transition-colors"
      >
        <span className="flex items-baseline gap-2 min-w-0">
          {isCollapsed ? (
            <ChevronRight size={12} className="text-zinc-600 self-center" />
          ) : (
            <ChevronDown size={12} className="text-zinc-600 self-center" />
          )}
          {section.icon && (
            <span className="text-zinc-500 text-xs">{section.icon}</span>
          )}
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500 truncate">
            {section.title}
          </h2>
        </span>
        <span
          className={cn(
            "text-[11px] tabular-nums shrink-0 ml-3",
            isComplete ? "text-emerald-300" : "text-zinc-600"
          )}
        >
          {done}/{totalItems}
        </span>
      </button>

      {!isCollapsed && (
        <ul className="divide-y divide-zinc-800/70">
          {section.items.map((item) => (
            <li key={item.id}>
              <div className="flex items-start gap-3 py-2 pl-3 pr-2 text-sm">
                <span
                  className={cn(
                    "mt-0.5 inline-block w-3 h-3 rounded-full ring-1 shrink-0",
                    item.checked
                      ? "bg-emerald-400/80 ring-emerald-400/30"
                      : "bg-transparent ring-zinc-600"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "flex-1 min-w-0",
                    item.checked
                      ? "text-zinc-500 line-through"
                      : "text-zinc-200"
                  )}
                >
                  {item.label}
                  {item.notes && (
                    <span className="block text-[11px] italic text-zinc-600 mt-0.5">
                      {item.notes}
                    </span>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
