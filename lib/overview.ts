import type { ChartRange } from "./dashboard-state";

export type CardTone = "blue" | "green" | "amber" | "rose" | "violet";

export function rangeToDays(range: ChartRange): 1 | 7 | 14 | 30 {
  switch (range) {
    case "Today":
      return 1;
    case "Last 7 days":
      return 7;
    case "Last 30 days":
      return 30;
    case "Last 14 days":
    default:
      return 14;
  }
}

export function formatScore(value: number | null): string {
  return value === null ? "—" : `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

export function formatTrend(value: number | null): string | null {
  if (value === null) return null;
  const amount = Number.isInteger(value) ? Math.abs(value) : Math.abs(value).toFixed(1);
  return `${value >= 0 ? "↑" : "↓"} ${amount}%`;
}

export function formatRelativeTime(
  value: string | null,
  now = new Date(),
): string {
  if (!value) return "—";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "—";
  const seconds = Math.max(0, Math.floor((now.getTime() - timestamp) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatActivityDate(value);
}

export function formatActivityDate(value: string): string {
  const timestamp = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(timestamp.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(timestamp);
}

export function statusTone(status: string): CardTone {
  switch (status.trim().toLowerCase()) {
    case "running":
    case "started":
      return "blue";
    case "completed":
    case "published":
    case "approved":
      return "green";
    case "queued":
    case "pending":
    case "scheduled":
      return "amber";
    case "failed":
    case "rejected":
      return "rose";
    default:
      return "violet";
  }
}
