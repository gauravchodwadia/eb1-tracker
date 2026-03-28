"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/hooks";
import { daysUntil, formatRelativeTime } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusBadge from "@/components/ui/StatusBadge";
import type {
  CriteriaData,
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
  TrendingUp,
  Clock,
} from "lucide-react";

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
        // If check fails, proceed to dashboard anyway
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

  const criteriaMet = criteria.filter(
    (c) => c.status === "strong" && c.strengthScore >= 4
  ).length;
  const evidenceFinal = evidence.filter((e) => e.status === "final").length;
  const lettersReceived = letters.filter((l) => l.status === "final_signed").length;
  const checklistTotal = checklist.reduce((acc, s) => acc + s.items.length, 0);
  const checklistChecked = checklist.reduce(
    (acc, s) => acc + s.items.filter((i) => i.checked).length, 0
  );

  const criteriaScore = Math.min(1, criteriaMet / 3) * 40;
  const evidenceScore = evidence.length > 0 ? (evidenceFinal / evidence.length) * 30 : 0;
  const checklistScore = checklistTotal > 0 ? (checklistChecked / checklistTotal) * 20 : 0;
  const lettersScore = Math.min(1, lettersReceived / 6) * 10;
  const readiness = Math.round(criteriaScore + evidenceScore + checklistScore + lettersScore);

  const currentPhase = timeline.find((p) => p.status === "in_progress");
  const daysTilFiling = daysUntil(settings.targetFilingDate);

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

        <StatCard icon={Target} label="Criteria Met" value={`${criteriaMet} of 10`} sub="Need 3+" color="text-indigo-400" />
        <StatCard icon={FileText} label="Evidence" value={`${evidenceFinal}`} sub={`of ${evidence.length} items final`} color="text-emerald-400" />
        <StatCard icon={Mail} label="Letters" value={`${lettersReceived}`} sub={`of ${letters.length} total`} color="text-amber-400" />
        <StatCard icon={Calendar} label="Days to Filing" value={daysTilFiling !== null ? `${daysTilFiling}` : "—"} sub={daysTilFiling !== null ? "days remaining" : "No target set"} color="text-purple-400" />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-400" /> Criteria Strength
          </h2>
          <span className="text-sm text-zinc-400">
            Meeting <span className="text-white font-medium">{criteriaMet} of 10</span> criteria (need 3+)
          </span>
        </div>
        <div className="space-y-3">
          {criteria.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 w-6 text-right shrink-0">{c.id}.</span>
              <span className="text-sm text-zinc-300 w-48 truncate shrink-0">{c.title}</span>
              <div className="flex-1">
                <ProgressBar
                  value={c.strengthScore} max={5}
                  color={c.strengthScore >= 4 ? "bg-emerald-500" : c.strengthScore >= 2 ? "bg-amber-500" : c.status === "not_applicable" ? "bg-zinc-600" : "bg-red-500"}
                />
              </div>
              <span className="text-xs text-zinc-500 w-8 text-right shrink-0">{c.strengthScore}/5</span>
            </div>
          ))}
        </div>
      </div>

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
                      {t.completed ? "✓" : "○"}
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

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Checklist Progress</h2>
          <span className="text-sm text-zinc-400">{checklistChecked} of {checklistTotal} items</span>
        </div>
        <ProgressBar value={checklistChecked} max={checklistTotal} color="bg-indigo-500" className="h-3" />
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
      <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-xl" />
    </div>
  );
}
