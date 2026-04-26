"use client";

import { useMemo } from "react";
import { useData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import ProgressSubNav from "@/components/layout/ProgressSubNav";
import type {
  LettersData,
  RecommendationLetter,
  LetterStatus,
} from "@/lib/types";
import { Loader2 } from "lucide-react";

const STATUS_GROUPS: { key: LetterStatus; label: string }[] = [
  { key: "final_signed", label: "Final & signed" },
  { key: "revision", label: "In revision" },
  { key: "draft_received", label: "Draft received" },
  { key: "draft_sent", label: "Draft sent" },
  { key: "contacted", label: "Contacted" },
  { key: "identified", label: "Identified" },
];

const STATUS_TONE: Record<LetterStatus, string> = {
  final_signed: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/20",
  revision: "text-amber-300 bg-amber-400/10 ring-amber-400/20",
  draft_received: "text-violet-300 bg-violet-400/10 ring-violet-400/20",
  draft_sent: "text-sky-300 bg-sky-400/10 ring-sky-400/20",
  contacted: "text-cyan-300 bg-cyan-400/10 ring-cyan-400/20",
  identified: "text-zinc-400 bg-zinc-500/10 ring-zinc-500/20",
};

const STATUS_LABEL: Record<LetterStatus, string> = {
  final_signed: "Signed",
  revision: "Revision",
  draft_received: "Drafted",
  draft_sent: "Draft sent",
  contacted: "Contacted",
  identified: "Identified",
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

export default function LettersPage() {
  const { data: letters, loading } = useData<LettersData>("letters");

  const grouped = useMemo(() => {
    const out: Record<LetterStatus, RecommendationLetter[]> = {
      final_signed: [],
      revision: [],
      draft_received: [],
      draft_sent: [],
      contacted: [],
      identified: [],
    };
    if (!letters) return out;
    for (const l of letters) out[l.status].push(l);
    for (const k of Object.keys(out) as LetterStatus[]) {
      out[k].sort((a, b) => {
        const da = daysFromNow(a.dueDate);
        const db = daysFromNow(b.dueDate);
        if (da !== null && db !== null) return da - db;
        if (da !== null) return -1;
        if (db !== null) return 1;
        return a.recommenderName.localeCompare(b.recommenderName);
      });
    }
    return out;
  }, [letters]);

  const totals = useMemo(() => {
    if (!letters) return { total: 0, signed: 0, independent: 0, dependent: 0, overdue: 0 };
    let signed = 0, independent = 0, dependent = 0, overdue = 0;
    for (const l of letters) {
      if (l.status === "final_signed") signed++;
      if (l.relationship === "independent") independent++;
      else dependent++;
      const d = daysFromNow(l.dueDate);
      if (d !== null && d < 0 && l.status !== "final_signed") overdue++;
    }
    return { total: letters.length, signed, independent, dependent, overdue };
  }, [letters]);

  if (loading || !letters) {
    return (
      <>
        <ProgressSubNav />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
        </div>
      </>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProgressSubNav />

      <div className="border-b border-zinc-800 pb-6 mb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Recommendation letters
        </h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm tabular-nums">
          <Stat n={totals.total} label="recommenders" />
          <Stat n={totals.signed} label="signed" tone="emerald" />
          <Stat n={totals.independent} label="independent" />
          <Stat n={totals.dependent} label="dependent" />
          <Stat n={totals.overdue} label="overdue" tone={totals.overdue ? "rose" : "muted"} />
        </div>
      </div>

      {letters.length === 0 ? (
        <EmptyState
          title="No recommendation letters yet"
          description="Add entries to your letters.json in the data repo to see them here."
        />
      ) : (
        <div>
          {STATUS_GROUPS.map((g) => {
            const rows = grouped[g.key];
            if (rows.length === 0) return null;
            return (
              <Section key={g.key} label={g.label} count={rows.length}>
                <ul className="divide-y divide-zinc-800/70">
                  {rows.map((l) => {
                    const days = daysFromNow(l.dueDate);
                    const isOverdue = days !== null && days < 0 && l.status !== "final_signed";
                    const keyDate = (() => {
                      if (l.status === "final_signed" && l.receivedDate) {
                        return `Signed ${fmtDate(l.receivedDate)}`;
                      }
                      if (l.dueDate) {
                        if (isOverdue) return `Overdue ${fmtDate(l.dueDate)}`;
                        if (days !== null && days <= 14) return `Due ${fmtDate(l.dueDate)} · ${days}d`;
                        return `Due ${fmtDate(l.dueDate)}`;
                      }
                      if (l.requestedDate) return `Requested ${fmtDate(l.requestedDate)}`;
                      return "";
                    })();
                    const dateCls = isOverdue
                      ? "text-rose-400"
                      : l.dueDate && days !== null && days <= 14 && l.status !== "final_signed"
                      ? "text-amber-300"
                      : "text-zinc-500";
                    return (
                      <li
                        key={l.id}
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
                          <span className="flex-1 min-w-0">
                            <span className="text-zinc-100 truncate block">
                              {l.recommenderName}
                            </span>
                            <span className="text-[11px] text-zinc-500 truncate block">
                              {l.recommenderTitle}
                              {l.organization && ` · ${l.organization}`}
                            </span>
                          </span>

                          {/* criteria addressed */}
                          <span className="hidden sm:flex items-center gap-1 shrink-0 w-24 justify-end">
                            {l.criteriaAddressed.slice(0, 5).map((n) => (
                              <span
                                key={n}
                                className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] tabular-nums text-zinc-300 bg-zinc-800/80 ring-1 ring-zinc-700/60"
                                title={`Criterion ${n}`}
                              >
                                {n}
                              </span>
                            ))}
                          </span>

                          {/* relationship */}
                          <span
                            className={cn(
                              "hidden md:inline text-[10px] uppercase tracking-wider font-medium w-20 text-right",
                              l.relationship === "independent"
                                ? "text-emerald-300/80"
                                : "text-sky-300/80"
                            )}
                          >
                            {l.relationship === "independent" ? "Indep." : "Dep."}
                          </span>

                          {/* date */}
                          <span className={cn("hidden md:inline text-xs tabular-nums w-36 text-right truncate", dateCls)}>
                            {keyDate}
                          </span>

                          {/* status pill */}
                          <span
                            className={cn(
                              "shrink-0 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ring-1 w-24 text-center",
                              STATUS_TONE[l.status]
                            )}
                          >
                            {STATUS_LABEL[l.status]}
                          </span>
                        </div>

                        {(l.notes || l.followUpCount > 0) && (
                          <div className="pl-3 pr-12 pb-2 -mt-1 text-xs text-zinc-500 flex flex-wrap gap-x-4 gap-y-1">
                            {l.followUpCount > 0 && (
                              <span>
                                {l.followUpCount} follow-up{l.followUpCount !== 1 ? "s" : ""}
                              </span>
                            )}
                            {l.notes && <span className="italic">{l.notes}</span>}
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
