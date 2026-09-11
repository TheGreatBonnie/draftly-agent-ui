import type { KnowledgeListItem, KnowledgeStatus } from "@/api/knowledge";

export function formatKnowledgeCount(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

export function formatKnowledgeTime(
  value: string | null | undefined,
  now = new Date(),
): string {
  if (!value) return "Unknown";
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return "Unknown";
  const minutes = Math.round((now.getTime() - timestamp.getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function knowledgeStatusLabel(status: KnowledgeStatus): string {
  return status === "needs-verification"
    ? "Needs verification"
    : status.charAt(0).toUpperCase() + status.slice(1);
}

export function knowledgeItemTitle(item: KnowledgeListItem): string {
  return item.entity?.trim() || "Untitled knowledge item";
}

export function knowledgeItemDescription(item: KnowledgeListItem): string {
  return item.description?.trim() || "No description available.";
}
