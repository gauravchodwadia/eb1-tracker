export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function statusColor(status: string): string {
  switch (status) {
    case "strong":
    case "final":
    case "final_signed":
    case "completed":
      return "text-emerald-400 bg-emerald-400/10";
    case "researching":
    case "evidence_gathering":
    case "in_progress":
    case "received":
    case "draft_received":
    case "reviewed":
      return "text-amber-400 bg-amber-400/10";
    case "weak":
    case "needed":
      return "text-red-400 bg-red-400/10";
    case "not_applicable":
      return "text-zinc-500 bg-zinc-500/10";
    default:
      return "text-zinc-400 bg-zinc-400/10";
  }
}

export function statusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
