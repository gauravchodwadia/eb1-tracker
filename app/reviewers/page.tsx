"use client";

import { useState, useMemo } from "react";
import { useData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import type {
  ReviewersData,
  ReviewerApplication,
  ReviewerStatus,
  ReviewerRelevance,
} from "@/lib/types";
import { ExternalLink, Loader2 } from "lucide-react";

// Status groups, in display order. Groups collapse multiple statuses that
// share the same operational meaning ("active" vs "to do" vs "watching" vs
// "closed"). Inside each group the original status is still visible as a pill.
type GroupKey = "active" | "in_flight" | "todo" | "watch" | "closed";

const GROUPS: { key: GroupKey; label: string; statuses: ReviewerStatus[] }[] = [
  { key: "active", label: "Accepted & enrolled", statuses: ["enrolled", "accepted"] },
  { key: "in_flight", label: "In flight", statuses: ["applied", "in_progress", "via_arr"] },
  { key: "todo", label: "To apply", statuses: ["to_apply"] },
  { key: "watch", label: "Watching", statuses: ["watch"] },
  { key: "closed", label: "Closed", statuses: ["closed", "rejected"] },
];

const STATUS_LABEL: Record<ReviewerStatus, string> = {
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

const STATUS_TONE: Record<ReviewerStatus, string> = {
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
  return t === "artifact_eval" ? "Artifact" : t.charAt(0).toUpperCase() + t.slice(1);
}

export default function ReviewersPage() {
  const { data, loading } = useData<ReviewersData>("reviewers");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const grouped = useMemo(() => {
    const out: Record<GroupKey, ReviewerApplication[]> = {
      active: [],
      in_flight: [],
      todo: [],
      watch: [],
      closed: [],
    };
    if (!data) return out;
    for (const r of data) {
      const g = GROUPS.find((g) => g.statuses.includes(r.status));
      if (g) out[g.key].push(r);
    }
    // Sort within each group: relevance asc (highest first), then follow-up
    // date (soonest/overdue first), then venue name.
    for (const k of Object.keys(out) as GroupKey[]) {
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
  }, [data]);

  const totals = useMemo(() => {
    if (!data) return { venues: 0, letters: 0, deadlinesSoon: 0, overdue: 0 };
    let letters = 0;
    let deadlinesSoon = 0;
    let overdue = 0;
    for (const r of data) {
      if (r.letterObtained) letters++;
      const d = daysFromNow(r.followUpDate);
      if (d !== null) {
        if (d < 0 && r.status !== "closed" && r.status !== "rejected") overdue++;
        else if (d <= 14 && d >= 0) deadlinesSoon++;
      }
    }
    return { venues: data.length, letters, deadlinesSoon, overdue };
  }, [data]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Title + summary line */}
      <div className="border-b border-zinc-800 pb-6 mb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Reviewer applications
        </h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm text-zinc-400 tabular-nums">
          <Stat n={totals.venues} label="venues" />
          <Stat n={totals.letters} label="letters" tone="emerald" />
          <Stat n={totals.deadlinesSoon} label="due ≤ 14d" tone={totals.deadlinesSoon ? "amber" : "muted"} />
          <Stat n={totals.overdue} label="overdue" tone={totals.overdue ? "rose" : "muted"} />
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No reviewer applications yet"
          description="Add venues to your reviewers.json in the data repo to see them here."
        />
      ) : (
        <div>
          {GROUPS.map((g) => {
            const rows = grouped[g.key];
            if (rows.length === 0) return null;
            return (
              <Section key={g.key} label={g.label} count={rows.length}>
                {rows.map((r) => {
                  const days = daysFromNow(r.followUpDate);
                  const isOverdue =
                    days !== null && days < 0 &&
                    r.status !== "closed" && r.status !== "rejected";
                  const isExpanded = expanded.has(r.id);
                  return (
                    <Row
                      key={r.id}
                      reviewer={r}
                      isOverdue={isOverdue}
                      days={days}
                      isExpanded={isExpanded}
                      onToggle={() => toggle(r.id)}
                    />
                  );
                })}
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
  tone?: "emerald" | "amber" | "rose" | "muted";
}) {
  const numCls =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "amber"
      ? "text-amber-300"
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
      <ul className="divide-y divide-zinc-800/70">{children}</ul>
    </section>
  );
}

function Row({
  reviewer: r,
  isOverdue,
  days,
  isExpanded,
  onToggle,
}: {
  reviewer: ReviewerApplication;
  isOverdue: boolean;
  days: number | null;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const primaryUrl = r.openReviewUrl || r.websiteUrl;
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
    !!r.eb1aValue || !!r.notes || !!r.contactInfo || !!r.formalTitle || !!r.location;

  return (
    <li
      className={cn(
        "relative",
        isOverdue && "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-rose-500/70"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "group w-full text-left flex items-center gap-3 py-2 pl-3 pr-2 text-sm",
          "hover:bg-zinc-900/60 transition-colors",
          isOverdue && "pl-4"
        )}
      >
        {/* venue name + type */}
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

        {/* relevance */}
        <span className={cn("hidden sm:inline text-xs tabular-nums w-20 text-right", RELEVANCE_TONE[r.relevance])}>
          {RELEVANCE_LABEL[r.relevance]}
        </span>

        {/* date / follow-up */}
        <span className={cn("hidden md:inline text-xs tabular-nums w-36 text-right truncate", dateCls)}>
          {dateText}
        </span>

        {/* status pill */}
        <span
          className={cn(
            "shrink-0 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ring-1 w-24 text-center",
            STATUS_TONE[r.status]
          )}
        >
          {STATUS_LABEL[r.status]}
        </span>

        {/* link */}
        {primaryUrl ? (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 p-1 rounded text-zinc-500 hover:text-indigo-300 hover:bg-zinc-800"
            aria-label="Open external link"
          >
            <ExternalLink size={13} />
          </a>
        ) : (
          <span className="w-[26px]" />
        )}
      </button>

      {/* expanded details */}
      {isExpanded && hasDetails && (
        <div className="pl-3 pr-12 pb-3 -mt-1 text-xs text-zinc-400 space-y-1.5">
          {r.eb1aValue && <p className="text-zinc-300">{r.eb1aValue}</p>}
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
