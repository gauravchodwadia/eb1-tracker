"use client";

import { useData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { BudgetData, BudgetItem } from "@/lib/types";
import EmptyState from "@/components/ui/EmptyState";
import { DollarSign, Loader2 } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Legal: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Government: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Administrative: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Medical: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        color
      )}
    >
      {category}
    </span>
  );
}

export default function BudgetPage() {
  const { data, loading } = useData<BudgetData>("budget");

  if (loading || !data) {
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
          <h1 className="text-2xl font-bold text-zinc-100">Budget Tracker</h1>
          <p className="text-sm text-zinc-500 mt-1">No budget items yet.</p>
        </div>
        <EmptyState
          title="No budget items"
          description="No budget items have been added yet."
        />
      </div>
    );
  }

  const totalEstimated = data.reduce((s, i) => s + i.estimatedCost, 0);
  const totalActual = data.reduce((s, i) => s + (i.actualCost ?? 0), 0);
  const totalRemaining = totalEstimated - totalActual;

  const i140Items = data.filter((i) => i.phase === "i140" || i.phase === "both");
  const i485Items = data.filter((i) => i.phase === "i485" || i.phase === "both");

  // Category breakdown
  const categoryTotals: Record<string, { estimated: number; actual: number }> = {};
  data.forEach((item) => {
    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = { estimated: 0, actual: 0 };
    }
    categoryTotals[item.category].estimated += item.estimatedCost;
    categoryTotals[item.category].actual += item.actualCost ?? 0;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Budget Tracker</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {data.filter((i) => i.paid).length} of {data.length} items paid
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            Total Estimated
          </div>
          <div className="text-xl font-bold text-zinc-100">
            {formatCurrency(totalEstimated)}
          </div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            Total Actual
          </div>
          <div className="text-xl font-bold text-indigo-400">
            {formatCurrency(totalActual)}
          </div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            Remaining
          </div>
          <div
            className={cn(
              "text-xl font-bold",
              totalRemaining >= 0 ? "text-emerald-400" : "text-red-400"
            )}
          >
            {formatCurrency(totalRemaining)}
          </div>
        </div>
      </div>

      {/* Category breakdown pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryTotals).map(([cat, totals]) => (
          <div
            key={cat}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border",
              CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other
            )}
          >
            <span className="font-medium">{cat}</span>
            <span className="opacity-70">{formatCurrency(totals.estimated)}</span>
          </div>
        ))}
      </div>

      {/* Phase groups as stacked cards */}
      <PhaseGroup title="I-140 Petition Costs" items={i140Items} />
      <PhaseGroup title="I-485 / Post-Approval Costs" items={i485Items} />
    </div>
  );
}

function PhaseGroup({ title, items }: { title: string; items: BudgetItem[] }) {
  if (items.length === 0) return null;

  const groupEstimated = items.reduce((s, i) => s + i.estimatedCost, 0);
  const groupActual = items.reduce((s, i) => s + (i.actualCost ?? 0), 0);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-700 pb-2">
        <h2 className="text-lg font-semibold text-zinc-200">{title}</h2>
        <span className="text-xs text-zinc-500">
          Est. {formatCurrency(groupEstimated)} &middot; Actual{" "}
          {formatCurrency(groupActual)}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-white font-medium text-base">{item.item}</h3>
              <CategoryBadge category={item.category} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-xs text-zinc-500 block">Estimated</span>
                <span className="text-zinc-200 font-medium">
                  {formatCurrency(item.estimatedCost)}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">Actual</span>
                <span className="text-zinc-200 font-medium">
                  {item.actualCost != null ? formatCurrency(item.actualCost) : "—"}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">Status</span>
                {item.paid ? (
                  <span className="text-emerald-400 font-medium">&#10003; Paid</span>
                ) : (
                  <span className="text-zinc-500 font-medium">&#9675; Unpaid</span>
                )}
              </div>
            </div>

            {item.notes && (
              <p className="text-xs text-zinc-500 mt-2">{item.notes}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
