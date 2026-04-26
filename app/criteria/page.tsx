"use client";

import Link from "next/link";
import { useData } from "@/lib/hooks";
import {
  CriteriaData,
  CriterionEntry,
  EvidenceData,
  CriterionStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { Loader2 } from "lucide-react";

const CRITERIA_TITLES: Record<number, string> = {
  1: "Awards",
  2: "Membership",
  3: "Published material",
  4: "Judging",
  5: "Original contributions",
  6: "Scholarly articles",
  7: "Exhibitions",
  8: "Leading or critical role",
  9: "High salary",
  10: "Commercial success",
};

const STATUS_PRIORITY: Record<CriterionStatus, number> = {
  evidence_gathering: 0,
  researching: 1,
  not_started: 2,
  weak: 3,
  strong: 4,
  not_applicable: 5,
};

const STATUS_LABEL: Record<CriterionStatus, string> = {
  not_started: "Not started",
  researching: "Researching",
  evidence_gathering: "Evidence",
  strong: "Strong",
  weak: "Weak",
  not_applicable: "N/A",
};

const STATUS_TONE: Record<CriterionStatus, string> = {
  not_started: "text-zinc-500 bg-zinc-500/10 ring-zinc-500/20",
  researching: "text-sky-300 bg-sky-400/10 ring-sky-400/20",
  evidence_gathering: "text-amber-300 bg-amber-400/10 ring-amber-400/20",
  strong: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/20",
  weak: "text-rose-300 bg-rose-400/10 ring-rose-400/20",
  not_applicable: "text-zinc-600 bg-zinc-500/5 ring-zinc-500/10",
};

export default function CriteriaPage() {
  const { data, loading } = useData<CriteriaData>("criteria");
  const { data: evidence } = useData<EvidenceData>("evidence");

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  const meeting = data.filter(
    (c) => c.status === "strong" && c.strengthScore >= 4
  ).length;

  const evidenceCountByCriterion: Record<number, number> = {};
  if (evidence) {
    for (const e of evidence) {
      evidenceCountByCriterion[e.criterionId] =
        (evidenceCountByCriterion[e.criterionId] || 0) + 1;
    }
  }

  const targeted = data
    .filter((c) => c.targeted)
    .sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]);
  const nonTargeted = data
    .filter((c) => !c.targeted)
    .sort((a, b) => a.id - b.id);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="border-b border-zinc-800 pb-6 mb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          EB-1A criteria
        </h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm tabular-nums">
          <span>
            <span className="font-medium text-zinc-200">{meeting}</span>{" "}
            <span className="text-zinc-500">of 10 strong</span>
          </span>
          <span>
            <span className="font-medium text-zinc-200">{targeted.length}</span>{" "}
            <span className="text-zinc-500">targeted</span>
          </span>
          <span className="text-zinc-600">need 3+</span>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No criteria data"
          description="Criteria information is not available yet."
        />
      ) : (
        <>
          {targeted.length > 0 && (
            <Section label="Targeted" count={targeted.length}>
              <ul className="divide-y divide-zinc-800/70">
                {targeted.map((c) => (
                  <CriterionRow
                    key={c.id}
                    criterion={c}
                    evidenceCount={evidenceCountByCriterion[c.id] || 0}
                    targeted
                  />
                ))}
              </ul>
            </Section>
          )}
          {nonTargeted.length > 0 && (
            <Section label="Other criteria" count={nonTargeted.length}>
              <ul className="divide-y divide-zinc-800/70">
                {nonTargeted.map((c) => (
                  <CriterionRow
                    key={c.id}
                    criterion={c}
                    evidenceCount={evidenceCountByCriterion[c.id] || 0}
                    targeted={false}
                  />
                ))}
              </ul>
            </Section>
          )}
        </>
      )}
    </div>
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

function CriterionRow({
  criterion: c,
  evidenceCount,
  targeted,
}: {
  criterion: CriterionEntry;
  evidenceCount: number;
  targeted: boolean;
}) {
  const dotTone =
    c.strengthScore >= 4
      ? "bg-emerald-400"
      : c.strengthScore >= 2
      ? "bg-amber-400"
      : c.strengthScore > 0
      ? "bg-rose-400"
      : "bg-zinc-700";
  const title = CRITERIA_TITLES[c.id] || c.title;
  const inner = (
    <div
      className={cn(
        "group flex items-center gap-3 py-2.5 pl-3 pr-2 text-sm",
        targeted ? "hover:bg-zinc-900/60 transition-colors" : "opacity-60"
      )}
    >
      <span className="text-[11px] tabular-nums text-zinc-600 w-6 shrink-0">
        C{c.id}
      </span>
      <span
        className={cn(
          "flex-1 min-w-0 truncate",
          targeted ? "text-zinc-100 group-hover:text-white" : "text-zinc-400"
        )}
      >
        {title}
      </span>

      {/* strength dots */}
      <span
        className="hidden sm:flex items-center gap-1 shrink-0"
        aria-label={`Strength ${c.strengthScore} of 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              i < c.strengthScore ? dotTone : "bg-zinc-700"
            )}
          />
        ))}
        <span className="ml-1.5 text-[11px] tabular-nums text-zinc-500 w-8 text-right">
          {c.strengthScore}/5
        </span>
      </span>

      {/* evidence count */}
      <span className="hidden md:inline text-[11px] tabular-nums text-zinc-500 w-20 text-right">
        {evidenceCount} evidence
      </span>

      {/* status pill */}
      <span
        className={cn(
          "shrink-0 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ring-1 w-24 text-center",
          STATUS_TONE[c.status]
        )}
      >
        {STATUS_LABEL[c.status]}
      </span>

      <span
        className={cn(
          "text-sm",
          targeted
            ? "text-zinc-700 group-hover:text-indigo-400 transition-colors"
            : "text-transparent"
        )}
      >
        ›
      </span>
    </div>
  );
  if (targeted) {
    return (
      <li>
        <Link href={`/criteria/${c.id}`}>{inner}</Link>
      </li>
    );
  }
  return <li>{inner}</li>;
}
