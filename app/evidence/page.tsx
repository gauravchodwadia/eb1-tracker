"use client";

import { useMemo } from "react";
import { useData } from "@/lib/hooks";
import { CriteriaData, EvidenceData } from "@/lib/types";
import { cn, formatDate, statusLabel } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { Loader2, FileText, Calendar } from "lucide-react";

export default function EvidencePage() {
  const { data, loading } = useData<EvidenceData>("evidence");
  const { data: criteria, loading: criteriaLoading } = useData<CriteriaData>("criteria");

  const criteriaMap = useMemo(() => {
    if (!criteria) return new Map<number, string>();
    return new Map(criteria.map((c) => [c.id, c.title]));
  }, [criteria]);

  const grouped = useMemo(() => {
    if (!data) return new Map<number, typeof data>();
    const map = new Map<number, typeof data>();
    data.forEach((item) => {
      const list = map.get(item.criterionId) ?? [];
      list.push(item);
      map.set(item.criterionId, list);
    });
    return map;
  }, [data]);

  if (loading || criteriaLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Evidence Tracker</h1>
          <p className="text-zinc-400 text-sm mt-1">0 evidence items tracked</p>
        </div>
        <EmptyState
          title="No evidence items"
          description="No evidence has been added yet."
        />
      </div>
    );
  }

  const sortedCriteria = Array.from(grouped.keys()).sort((a, b) => a - b);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Evidence Tracker</h1>
        <p className="text-zinc-400 text-sm mt-1">
          {data.length} evidence item{data.length !== 1 ? "s" : ""} tracked
        </p>
      </div>

      {/* Grouped by criterion */}
      {sortedCriteria.map((criterionId) => {
        const items = grouped.get(criterionId) ?? [];
        const criterionName = criteriaMap.get(criterionId) ?? "Unknown";

        return (
          <section key={criterionId} className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-200 border-b border-zinc-700 pb-2">
              Criterion {criterionId}: {criterionName}
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-medium text-base">{item.title}</h3>
                    <StatusBadge status={item.status} />
                  </div>

                  {item.description && (
                    <p className="text-zinc-400 text-sm mb-3">{item.description}</p>
                  )}

                  <div className="flex items-center gap-4">
                    {item.fileNote && (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <FileText size={13} />
                        {item.fileNote}
                      </span>
                    )}
                    {item.dueDate && (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Calendar size={13} />
                        {formatDate(item.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
