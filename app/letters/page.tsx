"use client";

import { useData } from "@/lib/hooks";
import { formatDate, cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import ProgressSubNav from "@/components/layout/ProgressSubNav";
import type {
  LettersData,
  RecommendationLetter,
  LetterStatus,
  CriteriaData,
} from "@/lib/types";
import { MessageSquare } from "lucide-react";

const LETTER_STAGES: { key: LetterStatus; label: string }[] = [
  { key: "identified", label: "Identified" },
  { key: "contacted", label: "Contacted" },
  { key: "draft_sent", label: "Draft Sent" },
  { key: "draft_received", label: "Draft Received" },
  { key: "revision", label: "Revision" },
  { key: "final_signed", label: "Final Signed" },
];

export default function LettersPage() {
  const { data: letters, loading } = useData<LettersData>("letters");
  const { data: criteria } = useData<CriteriaData>("criteria");

  if (loading || !letters) {
    return (
      <>
        <ProgressSubNav />
        <LettersSkeleton />
      </>
    );
  }

  const received = letters.filter((l) => l.status === "final_signed").length;
  const independent = letters.filter((l) => l.relationship === "independent").length;
  const dependent = letters.filter((l) => l.relationship === "dependent").length;

  return (
    <div className="space-y-8">
      <ProgressSubNav />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Recommendation Letters</h1>
        <p className="text-zinc-400 mt-1">
          Track recommendation letter progress
        </p>
      </div>

      {letters.length === 0 ? (
        <EmptyState
          title="No recommendation letters yet"
          description="No recommenders have been added yet."
        />
      ) : (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-400">Letters Received</p>
              <p className="text-lg font-bold text-white mt-1">
                {received}{" "}
                <span className="text-sm font-normal text-zinc-500">
                  of {letters.length}
                </span>
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-400">Independent</p>
              <p className="text-lg font-bold text-green-400 mt-1">{independent}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-400">Dependent</p>
              <p className="text-lg font-bold text-blue-400 mt-1">{dependent}</p>
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
              Letter Pipeline
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {LETTER_STAGES.map((stage, i) => {
                const count = letters.filter((l) => l.status === stage.key).length;
                return (
                  <div key={stage.key} className="flex items-center">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center px-4 py-3 rounded-lg border min-w-[120px]",
                        count > 0
                          ? "border-indigo-500/30 bg-indigo-500/5"
                          : "border-zinc-700 bg-zinc-800/50"
                      )}
                    >
                      <span
                        className={cn(
                          "text-2xl font-bold",
                          count > 0 ? "text-indigo-400" : "text-zinc-600"
                        )}
                      >
                        {count}
                      </span>
                      <span className="text-xs text-zinc-400 mt-1 whitespace-nowrap">
                        {stage.label}
                      </span>
                    </div>
                    {i < LETTER_STAGES.length - 1 && (
                      <div className="text-zinc-600 mx-1 shrink-0">&rarr;</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Letter Cards — single column */}
          <div className="space-y-4">
            {letters.map((letter) => (
              <div
                key={letter.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                {/* Name + title */}
                <div className="mb-3">
                  <h3 className="text-white font-semibold text-lg">
                    {letter.recommenderName}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {letter.recommenderTitle}
                    {letter.organization && ` at ${letter.organization}`}
                  </p>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      letter.relationship === "independent"
                        ? "text-green-400 bg-green-400/10"
                        : "text-blue-400 bg-blue-400/10"
                    )}
                  >
                    {letter.relationship === "independent"
                      ? "Independent"
                      : "Dependent"}
                  </span>
                  <StatusBadge status={letter.status} />
                </div>

                {/* Criteria addressed */}
                {letter.criteriaAddressed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {letter.criteriaAddressed.map((num) => (
                      <span
                        key={num}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                )}

                {/* Dates */}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400 mb-2">
                  <span>
                    Requested:{" "}
                    {letter.requestedDate
                      ? formatDate(letter.requestedDate)
                      : "—"}
                  </span>
                  <span>
                    Due:{" "}
                    {letter.dueDate ? formatDate(letter.dueDate) : "—"}
                  </span>
                  <span>
                    Received:{" "}
                    {letter.receivedDate
                      ? formatDate(letter.receivedDate)
                      : "—"}
                  </span>
                </div>

                {/* Follow-up count */}
                {letter.followUpCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mb-2">
                    <MessageSquare size={12} />
                    {letter.followUpCount} follow-up
                    {letter.followUpCount !== 1 ? "s" : ""}
                  </div>
                )}

                {/* Notes */}
                {letter.notes && (
                  <p className="text-sm text-zinc-500 mt-2">{letter.notes}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LettersSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-zinc-800 rounded w-64" />
        <div className="h-4 bg-zinc-800 rounded w-48 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-zinc-900 border border-zinc-800 rounded-xl"
          />
        ))}
      </div>
      <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-zinc-900 border border-zinc-800 rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
