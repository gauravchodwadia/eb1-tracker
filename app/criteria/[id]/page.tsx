"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/hooks";
import { formatDate, cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import EmptyState from "@/components/ui/EmptyState";
import type {
  CriteriaData,
  EvidenceData,
  ReviewersData,
  ReviewerStatus,
  ReviewerRelevance,
  CriterionStatus,
} from "@/lib/types";
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  Calendar,
  MapPin,
  Bell,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const CRITERION_LABELS: Record<number, string> = {
  1: "Awards",
  2: "Memberships",
  3: "Published Material / Media",
  4: "Judging",
  5: "Original Contributions",
  6: "Scholarly Articles / Publications",
  7: "Exhibitions",
  8: "Leading / Critical Role",
  9: "High Salary",
  10: "Commercial Success / Performing Arts",
};

function StrengthDots({ score }: { score: number }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((val) => (
        <div
          key={val}
          className={cn(
            "w-4 h-4 rounded-full",
            val <= score ? "bg-indigo-500" : "bg-zinc-700"
          )}
        />
      ))}
    </div>
  );
}

function evidenceStatusColor(status: string): string {
  switch (status) {
    case "final":
      return "border-emerald-500/30 bg-emerald-500/5";
    case "reviewed":
      return "border-blue-500/30 bg-blue-500/5";
    case "received":
      return "border-amber-500/30 bg-amber-500/5";
    case "requested":
      return "border-orange-500/30 bg-orange-500/5";
    case "needed":
    default:
      return "border-zinc-700/50 bg-zinc-800/30";
  }
}

// ===== Reviewer tracker constants (for Criterion 4) =====

const STATUS_STAGES: { key: ReviewerStatus; label: string; color: string }[] = [
  { key: "enrolled", label: "Enrolled", color: "bg-emerald-500" },
  { key: "accepted", label: "Accepted", color: "bg-green-500" },
  { key: "applied", label: "Applied", color: "bg-blue-500" },
  { key: "in_progress", label: "In Progress", color: "bg-amber-500" },
  { key: "to_apply", label: "To Apply", color: "bg-orange-500" },
  { key: "watch", label: "Watch", color: "bg-purple-500" },
  { key: "via_arr", label: "Via ARR", color: "bg-cyan-500" },
  { key: "closed", label: "Closed", color: "bg-zinc-500" },
  { key: "rejected", label: "Rejected", color: "bg-red-500" },
];

const RELEVANCE_LABELS: Record<ReviewerRelevance, string> = {
  highest: "Highest",
  high: "High",
  medium_high: "Med-High",
  medium: "Medium",
  low: "Low",
};

const RELEVANCE_COLORS: Record<ReviewerRelevance, string> = {
  highest: "text-red-400 bg-red-400/10",
  high: "text-orange-400 bg-orange-400/10",
  medium_high: "text-amber-400 bg-amber-400/10",
  medium: "text-zinc-400 bg-zinc-400/10",
  low: "text-zinc-500 bg-zinc-500/10",
};

const RELEVANCE_ORDER: ReviewerRelevance[] = [
  "highest",
  "high",
  "medium_high",
  "medium",
  "low",
];

function reviewerStatusColor(status: ReviewerStatus): string {
  switch (status) {
    case "enrolled":
    case "accepted":
      return "text-emerald-400 bg-emerald-400/10";
    case "applied":
      return "text-blue-400 bg-blue-400/10";
    case "in_progress":
      return "text-amber-400 bg-amber-400/10";
    case "to_apply":
      return "text-orange-400 bg-orange-400/10";
    case "watch":
      return "text-purple-400 bg-purple-400/10";
    case "via_arr":
      return "text-cyan-400 bg-cyan-400/10";
    case "closed":
      return "text-zinc-500 bg-zinc-500/10";
    case "rejected":
      return "text-red-400 bg-red-400/10";
    default:
      return "text-zinc-400 bg-zinc-400/10";
  }
}

// ===== Reviewer Tracker Section (Criterion 4) =====

function ReviewerTracker() {
  const { data, loading } = useData<ReviewersData>("reviewers");
  const [filterStatus, setFilterStatus] = useState<ReviewerStatus | "all">("all");
  const [showActionQueue, setShowActionQueue] = useState(true);

  const statusCounts = useMemo(() => {
    if (!data) return {};
    const counts: Partial<Record<ReviewerStatus, number>> = {};
    data.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  }, [data]);

  const actionItems = useMemo(() => {
    if (!data) return [];
    const now = new Date();
    return data
      .filter((r) => {
        if (r.followUpDate) {
          const d = new Date(r.followUpDate);
          const daysAway = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return daysAway <= 14;
        }
        if (r.status === "to_apply") return true;
        return false;
      })
      .sort((a, b) => {
        if (a.status === "to_apply" && b.status !== "to_apply") return -1;
        if (b.status === "to_apply" && a.status !== "to_apply") return 1;
        if (a.followUpDate && b.followUpDate)
          return new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime();
        return 0;
      });
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data
      .filter((r) => {
        if (filterStatus !== "all" && r.status !== filterStatus) return false;
        return true;
      })
      .sort((a, b) => {
        const relA = RELEVANCE_ORDER.indexOf(a.relevance);
        const relB = RELEVANCE_ORDER.indexOf(b.relevance);
        if (relA !== relB) return relA - relB;
        const statusOrder: ReviewerStatus[] = [
          "enrolled", "accepted", "in_progress", "applied",
          "to_apply", "watch", "via_arr", "closed", "rejected",
        ];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });
  }, [data, filterStatus]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  const enrolled = data.filter((r) => r.status === "enrolled" || r.status === "accepted").length;
  const applied = data.filter((r) => r.status === "applied").length;
  const lettersObtained = data.filter((r) => r.letterObtained).length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Reviewer Application Tracker</h2>
      <p className="text-zinc-400 text-sm">
        Conference &amp; journal reviewer applications for EB-1A Criterion 4
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{enrolled}</div>
          <div className="text-xs text-zinc-400">Enrolled</div>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{applied}</div>
          <div className="text-xs text-zinc-400">Applied</div>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">{statusCounts["to_apply"] || 0}</div>
          <div className="text-xs text-zinc-400">To Apply</div>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{statusCounts["watch"] || 0}</div>
          <div className="text-xs text-zinc-400">Watching</div>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-400">{lettersObtained}</div>
          <div className="text-xs text-zinc-400">Letters Obtained</div>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Status Pipeline</h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_STAGES.map((stage) => {
            const count = statusCounts[stage.key] || 0;
            const isActive = filterStatus === stage.key;
            return (
              <span
                key={stage.key}
                role="button"
                tabIndex={0}
                onClick={() => setFilterStatus(isActive ? "all" : stage.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilterStatus(isActive ? "all" : stage.key);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer select-none",
                  isActive
                    ? "border-indigo-500 bg-indigo-500/20 text-white"
                    : count > 0
                    ? "border-zinc-600 bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
                    : "border-zinc-700 bg-zinc-800/50 text-zinc-500"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", stage.color)} />
                {stage.label}
                <span className="text-zinc-400">({count})</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Action Queue */}
      {actionItems.length > 0 && (
        <div className="bg-zinc-800/50 border border-amber-500/30 rounded-lg">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowActionQueue(!showActionQueue)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowActionQueue(!showActionQueue);
              }
            }}
            className="w-full flex items-center justify-between p-4 cursor-pointer select-none"
          >
            <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2">
              <Bell size={16} />
              Action Queue ({actionItems.length} items)
            </h3>
            {showActionQueue ? (
              <ChevronUp size={16} className="text-zinc-400" />
            ) : (
              <ChevronDown size={16} className="text-zinc-400" />
            )}
          </div>
          {showActionQueue && (
            <div className="px-4 pb-4 space-y-2">
              {actionItems.map((item) => {
                const isOverdue = item.followUpDate && new Date(item.followUpDate) < new Date();
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "p-3 rounded-lg border",
                      isOverdue
                        ? "border-red-500/30 bg-red-500/5"
                        : "border-zinc-700/50 bg-zinc-800/30"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-medium", isOverdue ? "text-red-400" : "text-zinc-200")}>
                        {item.venueName}
                      </span>
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium", reviewerStatusColor(item.status))}>
                        {item.status === "to_apply" ? "TO APPLY" : item.status.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {item.contactInfo}
                      {item.followUpDate && (
                        <span className={cn("ml-2", isOverdue ? "text-red-400" : "text-amber-400")}>
                          {isOverdue ? "OVERDUE: " : "Follow up: "}
                          {formatDate(item.followUpDate)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Venue Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No reviewer applications found"
          description={filterStatus !== "all" ? "Try adjusting your filters." : "No venues have been added yet."}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={cn(
                "bg-zinc-800/50 border rounded-xl p-5",
                r.status === "enrolled" || r.status === "accepted"
                  ? "border-emerald-500/30"
                  : r.status === "to_apply"
                  ? "border-orange-500/20"
                  : "border-zinc-700/50"
              )}
            >
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h3 className="text-white font-medium text-lg">{r.venueName}</h3>
                <span className={cn("px-2 py-0.5 rounded text-xs font-medium", reviewerStatusColor(r.status))}>
                  {r.status.replace(/_/g, " ").toUpperCase()}
                </span>
                <span className={cn("px-2 py-0.5 rounded text-xs font-medium", RELEVANCE_COLORS[r.relevance])}>
                  {RELEVANCE_LABELS[r.relevance]}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium text-zinc-400 bg-zinc-700/50">
                  {r.venueType === "artifact_eval" ? "Artifact Eval" : r.venueType}
                </span>
                {r.letterObtained && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium text-emerald-400 bg-emerald-400/10">
                    <FileCheck size={12} className="inline mr-1" />
                    Letter
                  </span>
                )}
              </div>

              {r.eb1aValue && <p className="text-sm text-zinc-300 mb-2">{r.eb1aValue}</p>}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                {r.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {r.location}
                  </span>
                )}
                {r.eventDates && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(r.eventDates)}
                  </span>
                )}
                {r.contactInfo && <span className="truncate max-w-xs">{r.contactInfo}</span>}
                {r.formalTitle && <span className="text-indigo-400">Title: {r.formalTitle}</span>}
                {r.followUpDate && (
                  <span
                    className={cn(
                      "font-medium",
                      new Date(r.followUpDate) < new Date() ? "text-red-400" : "text-amber-400"
                    )}
                  >
                    <Bell size={12} className="inline mr-1" />
                    Follow up: {formatDate(r.followUpDate)}
                  </span>
                )}
              </div>

              {(r.openReviewUrl || r.websiteUrl) && (
                <div className="flex items-center gap-3 mt-2">
                  {r.openReviewUrl && (
                    <a
                      href={r.openReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      <ExternalLink size={12} />
                      OpenReview
                    </a>
                  )}
                  {r.websiteUrl && (
                    <a
                      href={r.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      <ExternalLink size={12} />
                      Website
                    </a>
                  )}
                </div>
              )}

              {r.notes && <p className="text-xs text-zinc-500 mt-2 italic">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Main Page Component =====

export default function CriterionPage() {
  const params = useParams();
  const criterionId = Number(params.id);

  const { data: criteria, loading: criteriaLoading } = useData<CriteriaData>("criteria");
  const { data: evidence, loading: evidenceLoading } = useData<EvidenceData>("evidence");

  if (criteriaLoading || !criteria) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  const criterion = criteria.find((c) => c.id === criterionId);

  if (!criterion) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link href="/criteria" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft size={16} />
          Back to Criteria
        </Link>
        <EmptyState title="Criterion not found" description={`No criterion with ID ${criterionId} was found.`} />
      </div>
    );
  }

  const criterionLabel = CRITERION_LABELS[criterion.id] || criterion.title;
  const criterionEvidence = evidence ? evidence.filter((e) => e.criterionId === criterionId) : [];
  const completedEvidence = criterionEvidence.filter((e) => e.status === "final" || e.status === "reviewed").length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/criteria" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft size={16} />
        Back to Criteria
      </Link>

      {/* Header */}
      <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">
                <span className="text-zinc-500 mr-2">{criterion.id}.</span>
                {criterionLabel}
              </h1>
              {criterion.targeted && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 uppercase tracking-wide">
                  Targeted
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-sm mt-2">{criterion.shortDescription}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status={criterion.status} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Strength</span>
            <StrengthDots score={criterion.strengthScore} />
          </div>
        </div>

        {criterion.notes && (
          <div className="border-t border-zinc-700/50 pt-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Notes</h3>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{criterion.notes}</p>
          </div>
        )}
      </div>

      {/* Evidence Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Evidence</h2>
          <span className="text-sm text-zinc-400">
            {completedEvidence}/{criterionEvidence.length} complete
          </span>
        </div>

        {criterionEvidence.length > 0 && (
          <ProgressBar
            value={completedEvidence}
            max={criterionEvidence.length}
            color="bg-indigo-500"
          />
        )}

        {evidenceLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
          </div>
        ) : criterionEvidence.length === 0 ? (
          <EmptyState title="No evidence yet" description="No evidence items have been linked to this criterion." />
        ) : (
          <div className="space-y-3">
            {criterionEvidence.map((e) => (
              <div
                key={e.id}
                className={cn("border rounded-lg p-4 space-y-2", evidenceStatusColor(e.status))}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-white font-medium text-sm">{e.title}</h3>
                  <StatusBadge status={e.status} />
                </div>
                {e.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed">{e.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                  {e.dueDate && <span>Due: {formatDate(e.dueDate)}</span>}
                  {e.completedAt && <span>Completed: {formatDate(e.completedAt)}</span>}
                  {e.fileNote && <span className="text-zinc-400">{e.fileNote}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Criterion 4: Reviewer Tracker */}
      {criterionId === 4 && (
        <div className="border-t border-zinc-700/50 pt-6">
          <ReviewerTracker />
        </div>
      )}
    </div>
  );
}
