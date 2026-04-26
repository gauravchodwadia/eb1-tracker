"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import type {
  CriteriaData,
  CriterionEntry,
  CriterionStatus,
  EvidenceData,
  EvidenceItem,
  EvidenceStatus,
  ReviewersData,
  ReviewerApplication,
  ReviewerRelevance,
  ReviewerStatus,
} from "@/lib/types";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const CRITERION_LABELS: Record<number, string> = {
  1: "Awards",
  2: "Memberships",
  3: "Published material",
  4: "Judging",
  5: "Original contributions",
  6: "Scholarly articles",
  7: "Exhibitions",
  8: "Leading or critical role",
  9: "High salary",
  10: "Commercial success",
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

const EVIDENCE_GROUPS: { key: EvidenceStatus; label: string }[] = [
  { key: "final", label: "Final" },
  { key: "reviewed", label: "Reviewed" },
  { key: "received", label: "Received" },
  { key: "requested", label: "Requested" },
  { key: "needed", label: "Needed" },
];

const EVIDENCE_TONE: Record<EvidenceStatus, string> = {
  final: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/20",
  reviewed: "text-sky-300 bg-sky-400/10 ring-sky-400/20",
  received: "text-violet-300 bg-violet-400/10 ring-violet-400/20",
  requested: "text-amber-300 bg-amber-400/10 ring-amber-400/20",
  needed: "text-rose-300 bg-rose-400/10 ring-rose-400/20",
};

const EVIDENCE_LABEL: Record<EvidenceStatus, string> = {
  final: "Final",
  reviewed: "Reviewed",
  received: "Received",
  requested: "Requested",
  needed: "Needed",
};

type ReviewerGroupKey = "active" | "in_flight" | "todo" | "watch" | "closed";

const REVIEWER_GROUPS: {
  key: ReviewerGroupKey;
  label: string;
  statuses: ReviewerStatus[];
}[] = [
  { key: "active", label: "Accepted & enrolled", statuses: ["enrolled", "accepted"] },
  { key: "in_flight", label: "In flight", statuses: ["applied", "in_progress", "via_arr"] },
  { key: "todo", label: "To apply", statuses: ["to_apply"] },
  { key: "watch", label: "Watching", statuses: ["watch"] },
  { key: "closed", label: "Closed", statuses: ["closed", "rejected"] },
];

const REVIEWER_STATUS_LABEL: Record<ReviewerStatus, string> = {
  enrolled: "Enrolled",
  accepted: "Accepted",
  applied: "Applied",
  in_progress: "In progress",
  to_apply: "To apply",
  watch: "Watching",
  via_arr: "Via ARR",
  closed: "Closed",
  rejected: "Rejected",
};

const REVIEWER_STATUS_TONE: Record<ReviewerStatus, string> = {
  enrolled: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/20",
  accepted: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/20",
  applied: "text-sky-300 bg-sky-400/10 ring-sky-400/20",
  in_progress: "text-amber-300 bg-amber-400/10 ring-amber-400/20",
  to_apply: "text-orange-300 bg-orange-400/10 ring-orange-400/20",
  watch: "text-violet-300 bg-violet-400/10 ring-violet-400/20",
  via_arr: "text-cyan-300 bg-cyan-400/10 ring-cyan-400/20",
  closed: "text-zinc-500 bg-zinc-500/10 ring-zinc-500/20",
  rejected: "text-rose-300 bg-rose-400/10 ring-rose-400/20",
};

const RELEVANCE_LABEL: Record<ReviewerRelevance, string> = {
  highest: "Highest",
  high: "High",
  medium_high: "Med-high",
  medium: "Medium",
  low: "Low",
};

const RELEVANCE_RANK: Record<ReviewerRelevance, number> = {
  highest: 0,
  high: 1,
  medium_high: 2,
  medium: 3,
  low: 4,
};

const RELEVANCE_TONE: Record<ReviewerRelevance, string> = {
  highest: "text-rose-300",
  high: "text-orange-300",
  medium_high: "text-amber-300",
  medium: "text-zinc-400",
  low: "text-zinc-600",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function venueTypeLabel(t: ReviewerApplication["venueType"]): string {
  if (t === "artifact_eval") return "Artifact";
  if (t === "book_review") return "Book";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const PAPER_REVIEW_TYPES: ReviewerApplication["venueType"][] = [
  "conference",
  "workshop",
  "journal",
  "artifact_eval",
];

type ReviewerBucket = {
  key: string;
  label: string;
  description?: string;
  match: (r: ReviewerApplication) => boolean;
  emptyHint: string;
};

const REVIEWER_BUCKETS: ReviewerBucket[] = [
  {
    key: "paper_reviews",
    label: "Paper reviews",
    description: "Conference, workshop, journal, and artifact evaluation venues.",
    match: (r) => PAPER_REVIEW_TYPES.includes(r.venueType),
    emptyHint: "Add reviewer applications with venueType: conference, workshop, journal, or artifact_eval.",
  },
  {
    key: "hackathons",
    label: "Hackathons",
    description: "Hackathon judging — invitations, confirmations, and completed events.",
    match: (r) => r.venueType === "hackathon",
    emptyHint: "Add entries with venueType: hackathon to your reviewers.json.",
  },
  {
    key: "book_reviews",
    label: "Book reviews",
    description: "Peer-reviewed book reviews (e.g., ACM Computing Reviews).",
    match: (r) => r.venueType === "book_review",
    emptyHint: "Add entries with venueType: book_review to your reviewers.json.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CriterionPage() {
  const params = useParams();
  const criterionId = Number(params.id);

  const { data: criteria, loading: criteriaLoading } = useData<CriteriaData>("criteria");
  const { data: evidence } = useData<EvidenceData>("evidence");

  if (criteriaLoading || !criteria) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  const criterion = criteria.find((c) => c.id === criterionId);

  if (!criterion) {
    return (
      <div className="max-w-5xl mx-auto">
        <Link
          href="/criteria"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-6"
        >
          <ArrowLeft size={14} />
          Back to criteria
        </Link>
        <EmptyState
          title="Criterion not found"
          description={`No criterion with ID ${criterionId} was found.`}
        />
      </div>
    );
  }

  const criterionEvidence = (evidence || []).filter(
    (e) => e.criterionId === criterionId
  );

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/criteria"
        className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-4"
      >
        <ArrowLeft size={12} />
        Back to criteria
      </Link>

      <Header criterion={criterion} evidenceCount={criterionEvidence.length} />

      <EvidenceSection
        items={criterionEvidence}
        loading={!evidence}
      />

      {criterionId === 4 && <JudgingActivities />}
    </div>
  );
}

// ─── Judging activities (criterion 4) ─────────────────────────────────────────

function JudgingActivities() {
  const { data, loading } = useData<ReviewersData>("reviewers");

  if (loading || !data) {
    return (
      <div className="mt-10 flex items-center justify-center h-24">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <>
      {REVIEWER_BUCKETS.map((bucket) => (
        <VenueBucketSection
          key={bucket.key}
          bucket={bucket}
          rows={data.filter(bucket.match)}
        />
      ))}
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
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
    <div className="border-b border-zinc-800 pb-6 mb-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-1">
        Criterion {c.id}
        {c.targeted && (
          <>
            <span className="text-zinc-700 mx-2">·</span>
            <span className="text-indigo-300">Targeted</span>
          </>
        )}
      </p>
      <h1 className="text-3xl font-semibold text-white tracking-tight">
        {CRITERION_LABELS[c.id] || c.title}
      </h1>
      <p className="text-sm text-zinc-400 mt-2 max-w-3xl">
        {c.shortDescription}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span
          className={cn(
            "text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ring-1",
            STATUS_TONE[c.status]
          )}
        >
          {STATUS_LABEL[c.status]}
        </span>
        <span
          className="flex items-center gap-1"
          aria-label={`Strength ${c.strengthScore} of 5`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i < c.strengthScore ? dotTone : "bg-zinc-700"
              )}
            />
          ))}
          <span className="ml-1.5 text-xs tabular-nums text-zinc-500">
            {c.strengthScore}/5
          </span>
        </span>
        <span className="text-xs tabular-nums text-zinc-500">
          {evidenceCount} evidence
        </span>
      </div>

      {c.notes && (
        <div className="mt-5 pt-4 border-t border-zinc-800/70">
          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-2">
            Notes
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {c.notes}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Evidence ─────────────────────────────────────────────────────────────────

function EvidenceSection({
  items,
  loading,
}: {
  items: EvidenceItem[];
  loading: boolean;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const grouped = useMemo(() => {
    const out: Record<EvidenceStatus, EvidenceItem[]> = {
      final: [],
      reviewed: [],
      received: [],
      requested: [],
      needed: [],
    };
    for (const e of items) out[e.status].push(e);
    for (const k of Object.keys(out) as EvidenceStatus[]) {
      out[k].sort((a, b) => {
        const da = daysFromNow(a.dueDate);
        const db = daysFromNow(b.dueDate);
        if (da !== null && db !== null) return da - db;
        if (da !== null) return -1;
        if (db !== null) return 1;
        return a.title.localeCompare(b.title);
      });
    }
    return out;
  }, [items]);

  const finalCount = items.filter((e) => e.status === "final").length;
  const overdue = items.filter((e) => {
    const d = daysFromNow(e.dueDate);
    return d !== null && d < 0 && e.status !== "final";
  }).length;

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="mt-6">
      <SectionHeader
        label="Evidence"
        meta={
          <span className="flex items-baseline gap-3 tabular-nums">
            <span className="text-zinc-500">
              <span className="text-zinc-300">{items.length}</span> items
            </span>
            <span className="text-zinc-500">
              <span className="text-emerald-300">{finalCount}</span> final
            </span>
            {overdue > 0 && (
              <span className="text-zinc-500">
                <span className="text-rose-300">{overdue}</span> overdue
              </span>
            )}
          </span>
        }
      />
      {loading ? (
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-6">
          <EmptyState
            title="No evidence yet"
            description="Linked evidence items will appear here."
          />
        </div>
      ) : (
        <div>
          {EVIDENCE_GROUPS.map((g) => {
            const rows = grouped[g.key];
            if (rows.length === 0) return null;
            return (
              <SubSection key={g.key} label={g.label} count={rows.length}>
                <ul className="divide-y divide-zinc-800/70">
                  {rows.map((e) => (
                    <EvidenceRow
                      key={e.id}
                      item={e}
                      isExpanded={expanded.has(e.id)}
                      onToggle={() => toggle(e.id)}
                    />
                  ))}
                </ul>
              </SubSection>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EvidenceRow({
  item: e,
  isExpanded,
  onToggle,
}: {
  item: EvidenceItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
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
  const hasDetails = !!e.description || !!e.fileNote || !!e.completedAt;

  return (
    <li
      className={cn(
        "relative",
        isOverdue &&
          "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-rose-500/70"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={!hasDetails}
        className={cn(
          "group w-full text-left flex items-center gap-3 py-2 pl-3 pr-2 text-sm transition-colors",
          hasDetails && "hover:bg-zinc-900/60 cursor-pointer",
          !hasDetails && "cursor-default",
          isOverdue && "pl-4"
        )}
      >
        <span className="flex-1 min-w-0 truncate text-zinc-100">
          {e.title}
        </span>
        <span
          className={cn(
            "hidden md:inline text-xs tabular-nums w-32 text-right truncate",
            dueCls
          )}
        >
          {dueText}
        </span>
        <span
          className={cn(
            "shrink-0 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ring-1 w-24 text-center",
            EVIDENCE_TONE[e.status]
          )}
        >
          {EVIDENCE_LABEL[e.status]}
        </span>
        <span
          className={cn(
            "w-3 text-zinc-700 text-xs",
            hasDetails && "group-hover:text-zinc-500"
          )}
          aria-hidden="true"
        >
          {hasDetails ? (isExpanded ? "−" : "+") : ""}
        </span>
      </button>
      {isExpanded && hasDetails && (
        <div className="pl-3 pr-12 pb-3 -mt-1 text-xs text-zinc-400 space-y-1.5">
          {e.description && <p className="leading-relaxed">{e.description}</p>}
          {(e.fileNote || e.completedAt) && (
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500">
              {e.completedAt && <span>Completed {fmtDate(e.completedAt)}</span>}
              {e.fileNote && <span>{e.fileNote}</span>}
            </p>
          )}
        </div>
      )}
    </li>
  );
}

// ─── Venue bucket (paper reviews / hackathons / book reviews) ─────────────────

function VenueBucketSection({
  bucket,
  rows,
}: {
  bucket: ReviewerBucket;
  rows: ReviewerApplication[];
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const grouped = useMemo(() => {
    const out: Record<ReviewerGroupKey, ReviewerApplication[]> = {
      active: [],
      in_flight: [],
      todo: [],
      watch: [],
      closed: [],
    };
    for (const r of rows) {
      const g = REVIEWER_GROUPS.find((g) => g.statuses.includes(r.status));
      if (g) out[g.key].push(r);
    }
    for (const k of Object.keys(out) as ReviewerGroupKey[]) {
      out[k].sort((a, b) => {
        const ra = RELEVANCE_RANK[a.relevance] - RELEVANCE_RANK[b.relevance];
        if (ra !== 0) return ra;
        const da = daysFromNow(a.followUpDate);
        const db = daysFromNow(b.followUpDate);
        if (da !== null && db !== null) return da - db;
        if (da !== null) return -1;
        if (db !== null) return 1;
        return a.venueName.localeCompare(b.venueName);
      });
    }
    return out;
  }, [rows]);

  const totals = useMemo(() => {
    let letters = 0, deadlinesSoon = 0, overdue = 0;
    for (const r of rows) {
      if (r.letterObtained) letters++;
      const d = daysFromNow(r.followUpDate);
      if (d !== null) {
        if (d < 0 && r.status !== "closed" && r.status !== "rejected") overdue++;
        else if (d <= 14 && d >= 0) deadlinesSoon++;
      }
    }
    return { count: rows.length, letters, deadlinesSoon, overdue };
  }, [rows]);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="mt-10">
      <SectionHeader
        label={bucket.label}
        meta={
          <span className="flex items-baseline gap-3 tabular-nums">
            <span className="text-zinc-500">
              <span className="text-zinc-300">{totals.count}</span>{" "}
              {totals.count === 1 ? "venue" : "venues"}
            </span>
            {totals.letters > 0 && (
              <span className="text-zinc-500">
                <span className="text-emerald-300">{totals.letters}</span> letters
              </span>
            )}
            {totals.deadlinesSoon > 0 && (
              <span className="text-zinc-500">
                <span className="text-amber-300">{totals.deadlinesSoon}</span> due ≤14d
              </span>
            )}
            {totals.overdue > 0 && (
              <span className="text-zinc-500">
                <span className="text-rose-300">{totals.overdue}</span> overdue
              </span>
            )}
          </span>
        }
      />
      {bucket.description && (
        <p className="text-xs text-zinc-500 -mt-1 mb-3">{bucket.description}</p>
      )}
      {rows.length === 0 ? (
        <div className="py-6">
          <EmptyState title={`No ${bucket.label.toLowerCase()} yet`} description={bucket.emptyHint} />
        </div>
      ) : (
        <div>
          {REVIEWER_GROUPS.map((g) => {
            const groupRows = grouped[g.key];
            if (groupRows.length === 0) return null;
            return (
              <SubSection key={g.key} label={g.label} count={groupRows.length}>
                <ul className="divide-y divide-zinc-800/70">
                  {groupRows.map((r) => (
                    <ReviewerRow
                      key={r.id}
                      reviewer={r}
                      isExpanded={expanded.has(r.id)}
                      onToggle={() => toggle(r.id)}
                    />
                  ))}
                </ul>
              </SubSection>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ReviewerRow({
  reviewer: r,
  isExpanded,
  onToggle,
}: {
  reviewer: ReviewerApplication;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const primaryUrl = r.openReviewUrl || r.websiteUrl;
  const days = daysFromNow(r.followUpDate);
  const isOverdue =
    days !== null && days < 0 &&
    r.status !== "closed" && r.status !== "rejected";
  const dateText = (() => {
    if (r.followUpDate) {
      if (isOverdue) return `Overdue ${fmtDate(r.followUpDate)}`;
      if (days !== null) {
        if (days === 0) return "Today";
        if (days <= 14) return `${fmtDate(r.followUpDate)} · ${days}d`;
      }
      return `Follow up ${fmtDate(r.followUpDate)}`;
    }
    if (r.eventDates) return fmtDate(r.eventDates);
    return "";
  })();
  const dateCls = isOverdue
    ? "text-rose-400"
    : r.followUpDate && days !== null && days <= 14
    ? "text-amber-300"
    : "text-zinc-500";
  const hasDetails =
    !!r.eb1aValue || !!r.notes || !!r.contactInfo ||
    !!r.formalTitle || !!r.location;

  return (
    <li
      className={cn(
        "relative",
        isOverdue &&
          "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-rose-500/70"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={!hasDetails}
        className={cn(
          "group w-full text-left flex items-center gap-3 py-2 pl-3 pr-2 text-sm transition-colors",
          hasDetails && "hover:bg-zinc-900/60 cursor-pointer",
          !hasDetails && "cursor-default",
          isOverdue && "pl-4"
        )}
      >
        <span className="flex-1 min-w-0 flex items-baseline gap-2">
          <span className="text-zinc-100 truncate">{r.venueName}</span>
          <span className="text-[11px] uppercase tracking-wider text-zinc-600 shrink-0">
            {venueTypeLabel(r.venueType)}
          </span>
          {r.letterObtained && (
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded text-emerald-300 bg-emerald-400/10 ring-1 ring-emerald-400/20 shrink-0">
              Letter
            </span>
          )}
        </span>
        <span
          className={cn(
            "hidden sm:inline text-xs tabular-nums w-20 text-right",
            RELEVANCE_TONE[r.relevance]
          )}
        >
          {RELEVANCE_LABEL[r.relevance]}
        </span>
        <span
          className={cn(
            "hidden md:inline text-xs tabular-nums w-36 text-right truncate",
            dateCls
          )}
        >
          {dateText}
        </span>
        <span
          className={cn(
            "shrink-0 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ring-1 w-24 text-center",
            REVIEWER_STATUS_TONE[r.status]
          )}
        >
          {REVIEWER_STATUS_LABEL[r.status]}
        </span>
        {primaryUrl ? (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(ev) => ev.stopPropagation()}
            className="shrink-0 p-1 rounded text-zinc-500 hover:text-indigo-300 hover:bg-zinc-800"
            aria-label="Open external link"
          >
            <ExternalLink size={13} />
          </a>
        ) : (
          <span className="w-[26px]" />
        )}
        <span
          className={cn(
            "w-3 text-zinc-700 text-xs",
            hasDetails && "group-hover:text-zinc-500"
          )}
          aria-hidden="true"
        >
          {hasDetails ? (isExpanded ? "−" : "+") : ""}
        </span>
      </button>
      {isExpanded && hasDetails && (
        <div className="pl-3 pr-12 pb-3 -mt-1 text-xs text-zinc-400 space-y-1.5">
          {r.eb1aValue && <p className="text-zinc-300 leading-relaxed">{r.eb1aValue}</p>}
          {(r.location || r.contactInfo || r.formalTitle) && (
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500">
              {r.location && <span>{r.location}</span>}
              {r.contactInfo && <span className="truncate">{r.contactInfo}</span>}
              {r.formalTitle && <span className="text-indigo-300">{r.formalTitle}</span>}
            </p>
          )}
          {r.notes && (
            <p className="italic text-zinc-500 leading-relaxed">{r.notes}</p>
          )}
        </div>
      )}
    </li>
  );
}

// ─── Section primitives ───────────────────────────────────────────────────────

function SectionHeader({
  label,
  meta,
}: {
  label: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-zinc-800/70 py-2 mb-2">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </h2>
      {meta && <div className="text-[11px] text-zinc-500">{meta}</div>}
    </div>
  );
}

function SubSection({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-baseline justify-between border-b border-zinc-800/40 py-1.5 mb-1">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
          {label}
        </h3>
        <span className="text-[10px] tabular-nums text-zinc-700">{count}</span>
      </div>
      {children}
    </div>
  );
}
