"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/hooks";
import { daysUntil, formatRelativeTime } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import type {
  CriteriaData,
  CriterionEntry,
  EvidenceData,
  LettersData,
  ChecklistData,
  TimelineData,
  ActivityData,
  Settings,
} from "@/lib/types";
import {
  Target,
  FileText,
  Mail,
  Calendar,
  Activity,
  Clock,
  ChevronRight,
} from "lucide-react";

const STATUS_PRIORITY: Record<string, number> = {
  evidence_gathering: 0,
  researching: 1,
  not_started: 2,
  weak: 3,
  strong: 4,
};

function sortByPriority(a: CriterionEntry, b: CriterionEntry): number {
  const pa = STATUS_PRIORITY[a.status] ?? 5;
  const pb = STATUS_PRIORITY[b.status] ?? 5;
  return pa - pb;
}

export default function DashboardPage() {
  const [repoChecked, setRepoChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/check-repo")
      .then((r) => r.json())
      .then((data) => {
        if (!data.exists) {
          router.push("/setup");
        } else {
          setRepoChecked(true);
        }
      })
      .catch(() => {
        setRepoChecked(true);
      });
  }, [router]);

  const { data: criteria } = useData<CriteriaData>("criteria");
  const { data: evidence } = useData<EvidenceData>("evidence");
  const { data: letters } = useData<LettersData>("letters");
  const { data: checklist } = useData<ChecklistData>("checklist");
  const { data: timeline } = useData<TimelineData>("timeline");
  const { data: activity } = useData<ActivityData>("activity");
  const { data: settings } = useData<Settings>("settings");

  if (!repoChecked || !criteria || !evidence || !letters || !checklist || !timeline || !activity || !settings) {
    return <DashboardSkeleton />;
  }

  // Focus on targeted criteria only
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

  // Readiness from targeted criteria only
  const criteriaScore = targetedCount > 0
    ? Math.min(1, targetedMet / Math.min(targetedCount, 3)) * 40
    : 0;
  const evidenceScore = evidence.length > 0 ? (evidenceFinal / evidence.length) * 30 : 0;
  const checklistScore = checklistTotal > 0 ? (checklistChecked / checklistTotal) * 20 : 0;
  const lettersScore = Math.min(1, lettersReceived / 6) * 10;
  const readiness = Math.round(criteriaScore + evidenceScore + checklistScore + lettersScore);

  const currentPhase = timeline.find((p) => p.status === "in_progress");
  const daysTilFiling = daysUntil(settings.targetFilingDate);

  // Sort targeted criteria by priority
  const sortedTargeted = [...targeted].sort(sortByPriority);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          {settings.applicantName
            ? `${settings.applicantName}'s EB-1A petition tracker`
            : "Your EB-1A petition tracker"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="col-span-2 md:col-span-1 bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#27272a" strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={readiness >= 60 ? "#22c55e" : readiness >= 30 ? "#eab308" : "#ef4444"}
                strokeWidth="3" strokeDasharray={`${readiness}, 100`} strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{readiness}%</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Overall Readiness</p>
        </div>

        <StatCard
          icon={Target}
          label="Criteria Met"
          value={`${targetedMet} of ${targetedCount}`}
          sub="targeted (need 3+)"
          color="text-indigo-400"
        />
        <StatCard
          icon={FileText}
          label="Evidence"
          value={`${evidenceFinal}`}
          sub={`of ${evidence.length} items final`}
          color="text-emerald-400"
        />
        <StatCard
          icon={Mail}
          label="Letters"
          value={`${lettersReceived}`}
          sub={`of ${letters.length} total`}
          color="text-amber-400"
        />
        <StatCard
          icon={Calendar}
          label="Days to Filing"
          value={daysTilFiling !== null ? `${daysTilFiling}` : "\u2014"}
          sub={daysTilFiling !== null ? "days remaining" : "No target set"}
          color="text-purple-400"
        />
      </div>

      {/* Targeted Criteria Cards */}
      {sortedTargeted.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target size={18} className="text-indigo-400" /> Targeted Criteria
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedTargeted.map((c) => {
              const evidenceForCriterion = evidence.filter(
                (e) => e.criterionId === c.id
              );
              const notesSummary = c.notes
                ? c.notes.length > 80
                  ? c.notes.slice(0, 80) + "\u2026"
                  : c.notes
                : null;

              return (
                <Link
                  key={c.id}
                  href={`/criteria/${c.id}`}
                  className="block bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {c.title}
                    </h3>
                    <ChevronRight
                      size={16}
                      className="text-zinc-600 group-hover:text-indigo-400 transition-colors shrink-0 mt-0.5"
                    />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-zinc-500">
                      {evidenceForCriterion.length} evidence item{evidenceForCriterion.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Strength dots */}
                  <div className="flex items-center gap-1.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${
                          i < c.strengthScore
                            ? c.strengthScore >= 4
                              ? "bg-emerald-500"
                              : c.strengthScore >= 2
                                ? "bg-amber-500"
                                : "bg-red-500"
                            : "bg-zinc-700"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-zinc-500 ml-1">{c.strengthScore}/5</span>
                  </div>

                  {notesSummary && (
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {notesSummary}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Phase + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-indigo-400" /> Current Phase
          </h2>
          {currentPhase ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={currentPhase.status} />
                <span className="text-sm font-medium text-white">{currentPhase.phase}</span>
              </div>
              <p className="text-sm text-zinc-400 mb-3">{currentPhase.description}</p>
              <div className="space-y-2">
                {currentPhase.tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-sm">
                    <span className={t.completed ? "text-emerald-400" : "text-zinc-600"}>
                      {t.completed ? "\u2713" : "\u25CB"}
                    </span>
                    <span className={t.completed ? "text-zinc-500 line-through" : "text-zinc-300"}>
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No phase in progress</p>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={18} className="text-indigo-400" /> Recent Activity
          </h2>
          {activity.length > 0 ? (
            <div className="space-y-3">
              {activity.slice(0, 10).map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300 truncate">{event.summary}</p>
                    <p className="text-xs text-zinc-600">{formatRelativeTime(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No activity yet. Start by reviewing your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={color} />
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{sub}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div><div className="h-8 bg-zinc-800 rounded w-48" /><div className="h-4 bg-zinc-800 rounded w-64 mt-2" /></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 bg-zinc-900 border border-zinc-800 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 bg-zinc-900 border border-zinc-800 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-48 bg-zinc-900 border border-zinc-800 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
