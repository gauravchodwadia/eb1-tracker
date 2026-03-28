"use client";

import { useData } from "@/lib/hooks";
import { CriteriaData, EvidenceData, CriterionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { Loader2 } from "lucide-react";

const EB1A_CRITERIA: { id: number; title: string; description: string }[] = [
  { id: 1, title: "Awards", description: "Nationally or internationally recognized prizes or awards for excellence in the field." },
  { id: 2, title: "Membership", description: "Membership in associations that require outstanding achievements of their members." },
  { id: 3, title: "Published Material", description: "Published material about you in professional or major trade publications or other major media." },
  { id: 4, title: "Judging", description: "Participation as a judge of the work of others in the same or an allied field." },
  { id: 5, title: "Original Contributions", description: "Original scientific, scholarly, artistic, athletic, or business-related contributions of major significance." },
  { id: 6, title: "Scholarly Articles", description: "Authorship of scholarly articles in professional or major trade publications or other major media." },
  { id: 7, title: "Exhibitions", description: "Display of your work at artistic exhibitions or showcases." },
  { id: 8, title: "Leading/Critical Role", description: "Performance in a leading or critical role for organizations with a distinguished reputation." },
  { id: 9, title: "High Salary", description: "Commanding a high salary or other significantly high remuneration relative to others in the field." },
  { id: 10, title: "Commercial Success", description: "Commercial successes in the performing arts, as shown by box office receipts or record, cassette, compact disk, or video sales." },
];

function borderColor(status: CriterionStatus): string {
  switch (status) {
    case "strong": return "border-l-emerald-500";
    case "researching":
    case "evidence_gathering": return "border-l-amber-500";
    case "weak": return "border-l-red-500";
    case "not_applicable":
    case "not_started":
    default: return "border-l-zinc-600";
  }
}

function segmentColor(status: CriterionStatus): string {
  switch (status) {
    case "strong": return "bg-emerald-500";
    case "researching":
    case "evidence_gathering": return "bg-amber-500";
    case "weak": return "bg-red-500";
    case "not_applicable": return "bg-zinc-600";
    default: return "bg-zinc-700";
  }
}

function StrengthDots({ score }: { score: number }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((val) => (
        <div
          key={val}
          className={cn(
            "w-4 h-4 rounded-full",
            val <= score
              ? "bg-indigo-500"
              : "bg-zinc-700"
          )}
        />
      ))}
    </div>
  );
}

export default function CriteriaPage() {
  const { data, loading } = useData<CriteriaData>("criteria");
  const { data: evidence } = useData<EvidenceData>("evidence");

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  const meetingCount = data.filter(
    (c) => c.status === "strong" && c.strengthScore >= 4
  ).length;

  // Count evidence items per criterion
  const evidenceCountByCriterion: Record<number, number> = {};
  if (evidence) {
    for (const e of evidence) {
      evidenceCountByCriterion[e.criterionId] = (evidenceCountByCriterion[e.criterionId] || 0) + 1;
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">EB-1A Criteria</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Meeting <span className="text-white font-semibold">{meetingCount}</span> of 10 criteria{" "}
          <span className="text-zinc-500">(need 3+)</span>
        </p>
      </div>

      {/* Segmented progress bar */}
      <div className="flex gap-1 h-2.5 rounded-full overflow-hidden bg-zinc-800">
        {data.map((c) => (
          <div
            key={c.id}
            className={cn(
              "flex-1 transition-colors duration-300 first:rounded-l-full last:rounded-r-full",
              segmentColor(c.status)
            )}
          />
        ))}
      </div>

      {data.length === 0 ? (
        <EmptyState title="No criteria data" description="Criteria information is not available yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.map((criterion) => {
            const meta = EB1A_CRITERIA.find((c) => c.id === criterion.id) ?? {
              title: `Criterion ${criterion.id}`,
              description: criterion.shortDescription,
            };
            const evidenceCount = evidenceCountByCriterion[criterion.id] || 0;

            return (
              <div
                key={criterion.id}
                className={cn(
                  "bg-zinc-800/60 border border-zinc-700 rounded-xl border-l-4 p-5 space-y-3",
                  borderColor(criterion.status)
                )}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-base">
                      <span className="text-zinc-500 mr-1.5">{criterion.id}.</span>
                      {meta.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{meta.description}</p>
                  </div>
                  {evidenceCount > 0 && (
                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300">
                      {evidenceCount} evidence
                    </span>
                  )}
                </div>

                {/* Status and strength */}
                <div className="flex flex-wrap items-center gap-4">
                  <StatusBadge status={criterion.status} />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Strength</span>
                    <StrengthDots score={criterion.strengthScore} />
                  </div>
                </div>

                {/* Notes */}
                {criterion.notes && (
                  <p className="text-sm text-zinc-400 leading-relaxed">{criterion.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
