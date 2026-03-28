"use client";

import { useState } from "react";
import { useData } from "@/lib/hooks";
import { cn, formatDate } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import ProgressSubNav from "@/components/layout/ProgressSubNav";
import type { TimelineData, TimelinePhase, TimelinePhaseStatus } from "@/lib/types";
import { ChevronDown, ChevronRight } from "lucide-react";

function statusDotClasses(status: TimelinePhaseStatus): string {
  switch (status) {
    case "completed":
      return "bg-emerald-500 border-emerald-400 shadow-emerald-500/40";
    case "in_progress":
      return "bg-indigo-500 border-indigo-400 shadow-indigo-500/40";
    default:
      return "bg-zinc-600 border-zinc-500 shadow-none";
  }
}

function StatusDot({ status }: { status: TimelinePhaseStatus }) {
  return (
    <div
      title={`Status: ${status.replace(/_/g, " ")}`}
      className={cn(
        "relative z-10 w-5 h-5 rounded-full border-2 shadow-lg flex-shrink-0",
        statusDotClasses(status)
      )}
    />
  );
}

function PhaseCard({
  phase,
  isLast,
}: {
  phase: TimelinePhase;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(phase.status === "in_progress");
  const isActive = phase.status === "in_progress";
  const completedTasks = phase.tasks.filter((t) => t.completed).length;

  const dateRange =
    phase.targetStartDate || phase.targetEndDate
      ? [
          phase.targetStartDate ? formatDate(phase.targetStartDate) : "TBD",
          phase.targetEndDate ? formatDate(phase.targetEndDate) : "TBD",
        ].join(" – ")
      : phase.defaultRange;

  return (
    <div className="flex gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <StatusDot status={phase.status} />
        {!isLast && <div className="w-0.5 flex-1 bg-zinc-700 mt-1" />}
      </div>

      {/* Card */}
      <div
        className={cn(
          "flex-1 mb-6 rounded-lg border p-4 transition-all duration-300",
          isActive
            ? "border-indigo-500/60 bg-indigo-500/5 shadow-[0_0_20px_-4px_rgba(99,102,241,0.25)]"
            : "border-zinc-800 bg-zinc-900/60"
        )}
      >
        {/* Header — collapse toggle */}
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-left group"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            )}
            <div>
              <h3 className="text-base font-semibold text-zinc-100">{phase.phase}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{dateRange}</p>
            </div>
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {phase.tasks.length > 0 && (
              <span>
                {completedTasks}/{phase.tasks.length} tasks
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 mt-2 ml-6">{phase.description}</p>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 ml-6 space-y-4">
            {/* Task list */}
            {phase.tasks.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Tasks
                </h4>
                <div className="space-y-1.5">
                  {phase.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "text-base leading-none",
                          task.completed ? "text-emerald-400" : "text-zinc-600"
                        )}
                      >
                        {task.completed ? "✓" : "○"}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          task.completed
                            ? "text-zinc-500 line-through"
                            : "text-zinc-300"
                        )}
                      >
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {phase.notes && (
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Notes
                </h4>
                <p className="text-sm text-zinc-400 whitespace-pre-wrap">{phase.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  const { data, loading } = useData<TimelineData>("timeline");

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-zinc-500">Loading timeline...</div>
      </div>
    );
  }

  const completedPhases = data.filter((p) => p.status === "completed").length;
  const totalTasks = data.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = data.reduce(
    (sum, p) => sum + p.tasks.filter((t) => t.completed).length,
    0
  );

  return (
    <div className="max-w-3xl mx-auto">
      <ProgressSubNav />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Project Timeline</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {completedPhases} of {data.length} phases completed &middot; {completedTasks}/
          {totalTasks} tasks done
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
          <span>Overall Progress</span>
          <span>{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
        </div>
        <ProgressBar value={completedTasks} max={totalTasks} color="bg-indigo-500" />
      </div>

      {/* Timeline */}
      <div>
        {data.map((phase, idx) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isLast={idx === data.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
