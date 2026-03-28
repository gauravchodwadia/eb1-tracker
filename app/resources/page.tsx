"use client";

import { useState } from "react";
import { useData } from "@/lib/hooks";
import type { ResourcesData } from "@/lib/types";
import EmptyState from "@/components/ui/EmptyState";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function ResourcesPage() {
  const { data, loading } = useData<ResourcesData>("resources");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (loading || !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl" />
        ))}
      </div>
    );
  }

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const isExpanded = (id: string) => expanded[id] !== false; // default open

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen size={24} className="text-indigo-400" />
          Resources
        </h1>
        <p className="text-zinc-400 mt-1">
          Curated links and references for your EB-1A journey
        </p>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No resources yet"
          description="Resource sections will appear here once configured."
        />
      ) : (
        <div className="space-y-4">
          {data.map((section) => (
            <div
              key={section.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              {/* Section header — collapse toggle */}
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-white">
                  {section.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">
                    {section.links.length} links
                  </span>
                  {isExpanded(section.id) ? (
                    <ChevronDown size={18} className="text-zinc-400" />
                  ) : (
                    <ChevronRight size={18} className="text-zinc-400" />
                  )}
                </div>
              </button>

              {isExpanded(section.id) && (
                <div className="px-4 pb-4 space-y-2">
                  {section.links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50"
                    >
                      <ExternalLink
                        size={14}
                        className="text-zinc-500 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
                        >
                          {link.label}
                        </a>
                        {link.notes && (
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {link.notes}
                          </p>
                        )}
                      </div>
                      {link.isCustom && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 shrink-0">
                          Custom
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
