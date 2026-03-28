"use client";

import { useState } from "react";
import { useData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import EmptyState from "@/components/ui/EmptyState";
import ProgressSubNav from "@/components/layout/ProgressSubNav";
import type { ChecklistData } from "@/lib/types";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function ChecklistPage() {
  const { data: checklist, loading } = useData<ChecklistData>("checklist");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (loading || !checklist) {
    return <ChecklistSkeleton />;
  }

  const totalItems = checklist.reduce((acc, s) => acc + s.items.length, 0);
  const checkedItems = checklist.reduce(
    (acc, s) => acc + s.items.filter((i) => i.checked).length,
    0
  );

  function toggleCollapse(sectionId: string) {
    setCollapsed((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  return (
    <div className="space-y-8">
      <ProgressSubNav />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Master Checklist</h1>
        <p className="text-zinc-400 mt-1">
          Track all required items for your EB-1A petition
        </p>
      </div>

      {checklist.length === 0 ? (
        <EmptyState
          title="No checklist items yet"
          description="Your checklist sections will appear here once configured."
        />
      ) : (
        <>
          {/* Overall Progress */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Overall Completion
              </h2>
              <span className="text-sm text-zinc-300">
                <span className="text-white font-bold">{checkedItems}</span>{" "}
                <span className="text-zinc-500">of {totalItems} items completed</span>
              </span>
            </div>
            <ProgressBar value={checkedItems} max={totalItems} color="bg-indigo-500" className="h-3" />
          </div>

          {/* Section Cards */}
          <div className="space-y-4">
            {checklist.map((section) => {
              const sectionChecked = section.items.filter((i) => i.checked).length;
              const sectionTotal = section.items.length;
              const isCollapsed = collapsed[section.id] ?? false;

              return (
                <div
                  key={section.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                >
                  {/* Section Header — collapse toggle */}
                  <button
                    onClick={() => toggleCollapse(section.id)}
                    className="w-full flex items-center gap-3 p-5 text-left hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="text-xl shrink-0">{section.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-white font-semibold truncate">
                          {section.title}
                        </h3>
                        <span className="text-xs text-zinc-400 shrink-0 ml-3">
                          {sectionChecked} of {sectionTotal}
                        </span>
                      </div>
                      <ProgressBar
                        value={sectionChecked}
                        max={sectionTotal}
                        color={
                          sectionChecked === sectionTotal && sectionTotal > 0
                            ? "bg-emerald-500"
                            : "bg-indigo-500"
                        }
                      />
                    </div>
                    <span className="text-zinc-500 shrink-0 ml-2">
                      {isCollapsed ? (
                        <ChevronRight size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </span>
                  </button>

                  {/* Section Items */}
                  {!isCollapsed && (
                    <div className="border-t border-zinc-800">
                      <div className="divide-y divide-zinc-800/50">
                        {section.items.map((item) => (
                          <div key={item.id} className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "text-lg shrink-0 leading-none",
                                  item.checked ? "text-emerald-400" : "text-zinc-600"
                                )}
                              >
                                {item.checked ? "✓" : "○"}
                              </span>
                              <span
                                className={cn(
                                  "flex-1 text-sm",
                                  item.checked
                                    ? "text-zinc-500 line-through"
                                    : "text-zinc-300"
                                )}
                              >
                                {item.label}
                              </span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-zinc-500 italic mt-1 ml-9">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function ChecklistSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-zinc-800 rounded w-56" />
        <div className="h-4 bg-zinc-800 rounded w-72 mt-2" />
      </div>
      <div className="h-20 bg-zinc-900 border border-zinc-800 rounded-xl" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 bg-zinc-900 border border-zinc-800 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
