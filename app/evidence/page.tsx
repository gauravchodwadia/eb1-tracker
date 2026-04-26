"use client";

import { useMemo } from "react";
import { useData } from "@/lib/hooks";
import { CriteriaData, EvidenceData, EvidenceItem, EvidenceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { Loader2 } from "lucide-react";

const STATUS_GROUPS: { key: EvidenceStatus; label: string }[] = [
  { key: "final", label: "Final" },
  { key: "reviewed", label: "Reviewed" },
  { key: "received", label: "Received" },
  { key: "requested", label: "Requested" },
  { key: "needed", label: "Needed" },
];

const STATUS_TONE: Record<EvidenceStatus, string> = {
  final: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/20",
  reviewed: "text-sky-300 bg-sky-400/10 ring-sky-400/20",
  received: "text-violet-300 bg-violet-400/10 ring-violet-400/20",
  requested: "text-amber-300 bg-amber-400/10 ring-amber-400/20",
  needed: "text-rose-300 bg-rose-400/10 ring-rose-400/20",
};

const STATUS_LABEL: Record<EvidenceStatus, string> = {
  final: "Final",
  reviewed: "Reviewed",
  received: "Received",
  requested: "Requested",
  needed: "Needed",
};

function fmtDate(s: string | null): string {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysFromNow(s: string | null): number | null {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function EvidencePage() {
  const { data, loading } = useData<EvidenceData>("evidence");
  const { data: criteria, loading: criteriaLoading } = useData<CriteriaData>("criteria");

  const criteriaMap = useMemo(() => {
    if (!criteria) return new Map<number, string>();
    return new Map(criteria.map((c) => [c.id, c.title]));
  }, [criteria]);

  const grouped = useMemo(() => {
    const out: Record<EvidenceStatus, EvidenceItem[]> = {
      final: [],
      reviewed: [],
      received: [],
      requested: [],
      needed: [],
    };
    if (!data) return out;
    for (const e of data) out[e.status].push(e);
    for (const k of Object.keys(out) as EvidenceStatus[]) {
      out[k].sort((a, b) => {
        if (a.criterionId !== b.criterionId) return a.criterionId - b.criterionId;
        const da = daysFromNow(a.dueDate);
        const db = daysFromNow(b.dueDate);
        if (da !== null && db !== null) return da - db;
        if (da !== null) return -1;
        if (db !== null) return 1;
        return a.title.localeCompare(b.title);
      });
    }
    return out;
  }, [data]);

  const totals = useMemo(() => {
    if (!data) return { items: 0, finalCount: 0, overdue: 0 };
    let finalCount = 0;
    let overdue = 0;
    for (const e of data) {
      if (e.status === "final") finalCount++;
      const d = daysFromNow(e.dueDate);
      if (d !== null && d < 0 && e.status !== "final") overdue++;
    }
    return { items: data.length, finalCount, overdue };
  }, [data]);

  if (loading || criteriaLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="border-b border-zinc-800 pb-6 mb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Evidence</h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm tabular-nums">
          <Stat n={totals.items} label="items" />
          <Stat n={totals.finalCount} label="final" tone="emerald" />
          <Stat n={totals.overdue} label="overdue" tone={totals.overdue ? "rose" : "muted"} />
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No evidence items yet"
          description="Add entries to your evidence.json in the data repo to see them here."
        />
      ) : (
        <div>
          {STATUS_GROUPS.map((g) => {
            const rows = grouped[g.key];
            if (rows.length === 0) return null;
            return (
              <Section key={g.key} label={g.label} count={rows.length}>
                <ul className="divide-y divide-zinc-800/70">
                  {rows.map((e) => {
                    const days = daysFromNow(e.dueDate);
                    const isOverdue = days !== null && days < 0 && e.status !== "final";
                    const dueText = (() => {
                      if (!e.dueDate) return "";
                      if (isOverdue) return `Overdue ${fmtDate(e.dueDate)}`;
                      if (days !== null && days <= 14) return `${fmtDate(e.dueDate)} · ${days}d`;
                      return fmtDate(e.dueDate);
                    })();
                    const dueCls = isOverdue
                      ? "text-rose-400"
                      : days !== null && days <= 14
                      ? "text-amber-300"
                      : "text-zinc-500";
                    const criterionTitle = criteriaMap.get(e.criterionId);
                    return (
                      <li
                        key={e.id}
                        className={cn(
                          "relative",
                          isOverdue &&
                            "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-rose-500/70"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-3 py-2 pl-3 pr-2 text-sm",
                            isOverdue && "pl-4"
                          )}
                        >
                          <span className="flex-1 min-w-0 flex items-baseline gap-2">
                            <span className="text-zinc-100 truncate">{e.title}</span>
                          </span>
                          <span
                            className="hidden sm:inline text-[11px] tabular-nums text-zinc-500 w-32 text-right truncate"
                            title={criterionTitle}
                          >
                            <span className="text-zinc-400">C{e.criterionId}</span>
                            {criterionTitle && (
                              <span className="text-zinc-600">
                                {" · "}
                                {criterionTitle.length > 18
                                  ? criterionTitle.slice(0, 18) + "…"
                                  : criterionTitle}
                              </span>
                            )}
                          </span>
                          <span className={cn("hidden md:inline text-xs tabular-nums w-32 text-right truncate", dueCls)}>
                            {dueText}
                          </span>
                          <span
                            className={cn(
                              "shrink-0 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ring-1 w-24 text-center",
                              STATUS_TONE[e.status]
                            )}
                          >
                            {STATUS_LABEL[e.status]}
                          </span>
                        </div>
                        {(e.description || e.fileNote) && (
                          <div className="pl-3 pr-12 pb-2 -mt-1 text-xs text-zinc-500">
                            {e.description && (
                              <p className="text-zinc-400">{e.description}</p>
                            )}
                            {e.fileNote && (
                              <p className="italic mt-0.5">{e.fileNote}</p>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({
  n,
  label,
  tone,
}: {
  n: number;
  label: string;
  tone?: "emerald" | "rose" | "muted";
}) {
  const numCls =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "rose"
      ? "text-rose-300"
      : tone === "muted"
      ? "text-zinc-600"
      : "text-zinc-200";
  return (
    <span>
      <span className={cn("font-medium", numCls)}>{n}</span>{" "}
      <span className="text-zinc-500">{label}</span>
    </span>
  );
}

function Section({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 last:mb-0">
      <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm flex items-baseline justify-between border-b border-zinc-800/70 py-2 mb-1">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          {label}
        </h2>
        <span className="text-[11px] tabular-nums text-zinc-600">{count}</span>
      </div>
      {children}
    </section>
  );
}
