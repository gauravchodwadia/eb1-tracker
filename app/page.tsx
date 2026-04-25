"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/hooks";
import { daysUntil, formatRelativeTime, cn } from "@/lib/utils";
import type {
  CriteriaData,
  CriterionEntry,
  CriterionStatus,
  EvidenceData,
  LettersData,
  ChecklistData,
  TimelineData,
  ActivityData,
  Settings,
} from "@/lib/types";

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

function readinessTone(n: number): string {
  if (n >= 70) return "text-emerald-300";
  if (n >= 40) return "text-amber-300";
  return "text-rose-300";
}

function readinessBar(n: number): string {
  if (n >= 70) return "bg-emerald-400";
  if (n >= 40) return "bg-amber-400";
  return "bg-rose-400";
}

export default function DashboardPage() {
  const [repoChecked, setRepoChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/check-repo")
      .then((r) => r.json())
      .then((data) => {
        if (!data.exists) router.push("/setup");
        else setRepoChecked(true);
      })
      .catch(() => setRepoChecked(true));
  }, [router]);

  const { data: criteria } = useData<CriteriaData>("criteria");
  const { data: evidence } = useData<EvidenceData>("evidence");
  const { data: letters } = useData<LettersData>("letters");
  const { data: checklist } = useData<ChecklistData>("checklist");
  const { data: timeline } = useData<TimelineData>("timeline");
  const { data: activity } = useData<ActivityData>("activity");
  const { data: settings } = useData<Settings>("settings");

  if (
    !repoChecked ||
    !criteria || !evidence || !letters ||
    !checklist || !timeline || !activity || !settings
  ) {
    return <DashboardSkeleton />;
  }

  const targeted = criteria.filter((c) => c.targeted);
  const targetedCount = targeted.length;
  const targetedMet = targeted.filter(
    (c) => c.status === "strong" && c.strengthScore >= 4
  ).length;
  const evidenceFinal = evidence.filter((e) => e.status === "final").length;
  const lettersReceived = letters.filter((l) => l.status === "final_signed").length;
  const checklistTotal = checklist.reduce((acc, s) => acc + s.items.length, 0);
  const checklistChecked = checklist.reduce(
    (acc, s) => acc + s.items.filter((i) => i.checked).length, 0
  );

  const criteriaScore = targetedCount > 0
    ? Math.min(1, targetedMet / Math.min(targetedCount, 3)) * 40
    : 0;
  const evidenceScore = evidence.length > 0
    ? (evidenceFinal / evidence.length) * 30
    : 0;
  const checklistScore = checklistTotal > 0
    ? (checklistChecked / checklistTotal) * 20
    : 0;
  const lettersScore = Math.min(1, lettersReceived / 6) * 10;
  const readiness = Math.round(
    criteriaScore + evidenceScore + checklistScore + lettersScore
  );

  const currentPhase = timeline.find((p) => p.status === "in_progress");
  const daysTilFiling = daysUntil(settings.targetFilingDate);

  const sortedTargeted = [...targeted].sort(
    (a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-1">
          {settings.applicantName || "EB-1A"} · Petition tracker
        </p>
        <div className="flex items-baseline gap-4 flex-wrap">
          <div className={cn("text-5xl font-semibold tabular-nums tracking-tight", readinessTone(readiness))}>
            {readiness}<span className="text-2xl text-zinc-500 font-normal">%</span>
          </div>
          <div className="text-sm text-zinc-500 flex flex-wrap items-baseline gap-x-5 gap-y-1 tabular-nums">
            <span>
              <span className="text-zinc-200">{targetedMet}</span>
              <span className="text-zinc-600"> / </span>
              <span className="text-zinc-300">{targetedCount}</span>
              <span className="text-zinc-500"> criteria strong</span>
            </span>
            <span>
              <span className="text-zinc-200">{evidenceFinal}</span>
              <span className="text-zinc-600"> / </span>
              <span className="text-zinc-300">{evidence.length}</span>
              <span className="text-zinc-500"> evidence final</span>
            </span>
            <span>
              <span className="text-zinc-200">{lettersReceived}</span>
              <span className="text-zinc-600"> / </span>
              <span className="text-zinc-300">{letters.length}</span>
              <span className="text-zinc-500"> letters signed</span>
            </span>
            {daysTilFiling !== null && (
              <span>
                <span className="text-zinc-200">{daysTilFiling}</span>
                <span className="text-zinc-500"> days to filing</span>
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 h-1 w-full bg-zinc-800/70 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", readinessBar(readiness))}
            style={{ width: `${Math.max(2, readiness)}%` }}
          />
        </div>
      </div>

      {/* Targeted criteria */}
      {sortedTargeted.length > 0 && (
        <Section
          label="Targeted criteria"
          count={`${targetedMet} of ${targetedCount} strong`}
        >
          <ul className="divide-y divide-zinc-800/70">
            {sortedTargeted.map((c) => (
              <CriterionRow
                key={c.id}
                criterion={c}
                evidenceCount={evidence.filter((e) => e.criterionId === c.id).length}
              />
            ))}
          </ul>
        </Section>
      )}

      {/* Current phase */}
      <Section
        label="Current phase"
        count={currentPhase ? currentPhase.phase : "Not started"}
      >
        {currentPhase ? (
          <div className="py-3">
            <p className="text-sm text-zinc-400 mb-3">{currentPhase.description}</p>
            <ul className="space-y-1.5">
              {currentPhase.tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "inline-block w-3 h-3 rounded-full ring-1 shrink-0",
                      t.completed
                        ? "bg-emerald-400/80 ring-emerald-400/30"
                        : "bg-transparent ring-zinc-600"
                    )}
                    aria-hidden="true"
                  />
                  <span className={t.completed ? "text-zinc-500 line-through" : "text-zinc-200"}>
                    {t.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="py-4 text-sm text-zinc-500">No phase in progress.</p>
        )}
      </Section>

      {/* Other counts */}
      <Section label="Checklist" count={`${checklistChecked} of ${checklistTotal} done`}>
        <div className="py-3">
          <div className="h-1 w-full bg-zinc-800/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full"
              style={{
                width: `${checklistTotal > 0 ? Math.max(2, (checklistChecked / checklistTotal) * 100) : 0}%`,
              }}
            />
          </div>
          <Link
            href="/checklist"
            className="inline-block mt-3 text-xs text-indigo-400 hover:text-indigo-300"
          >
            View checklist →
          </Link>
        </div>
      </Section>

      {/* Recent activity */}
      <Section
        label="Recent activity"
        count={activity.length === 0 ? "Nothing yet" : `${Math.min(activity.length, 8)} of ${activity.length}`}
      >
        {activity.length > 0 ? (
          <ul className="divide-y divide-zinc-800/70">
            {activity.slice(0, 8).map((event) => (
              <li key={event.id} className="flex items-center gap-3 py-2 text-sm">
                <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                <span className="flex-1 min-w-0 text-zinc-300 truncate">{event.summary}</span>
                <span className="text-[11px] tabular-nums text-zinc-600 shrink-0">
                  {formatRelativeTime(event.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-sm text-zinc-500">
            Start by reviewing your criteria.
          </p>
        )}
      </Section>
    </div>
  );
}

function Section({
  label,
  count,
  children,
}: {
  label: string;
  count: string | number;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 last:mb-0">
      <div className="flex items-baseline justify-between border-b border-zinc-800/70 py-2 mb-1">
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
}: {
  criterion: CriterionEntry;
  evidenceCount: number;
}) {
  const dotTone =
    c.strengthScore >= 4
      ? "bg-emerald-400"
      : c.strengthScore >= 2
      ? "bg-amber-400"
      : c.strengthScore > 0
      ? "bg-rose-400"
      : "bg-zinc-700";
  return (
    <li>
      <Link
        href={`/criteria/${c.id}`}
        className="group flex items-center gap-3 py-2.5 pl-3 pr-2 text-sm hover:bg-zinc-900/60 transition-colors"
      >
        <span className="flex-1 min-w-0 truncate text-zinc-100 group-hover:text-white">
          {c.title}
        </span>

        {/* strength dots */}
        <span className="hidden sm:flex items-center gap-1 shrink-0" aria-label={`Strength ${c.strengthScore} of 5`}>
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

        <span className="text-zinc-700 group-hover:text-indigo-400 transition-colors text-sm">
          ›
        </span>
      </Link>
    </li>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="border-b border-zinc-800 pb-6 mb-8 space-y-3">
        <div className="h-3 w-40 bg-zinc-800 rounded" />
        <div className="h-12 w-32 bg-zinc-800 rounded" />
        <div className="h-1 w-full bg-zinc-800 rounded" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mb-8">
          <div className="h-3 w-32 bg-zinc-800 rounded mb-3" />
          <div className="h-32 bg-zinc-900/50 rounded" />
        </div>
      ))}
    </div>
  );
}
