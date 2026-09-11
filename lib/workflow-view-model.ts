import type { DefinitionStatus, WorkflowDefinition, WorkflowStage } from "../api/workflows";

const STAGE_ORDER: Record<string, string[]> = {
  github_pr: ["analyze", "research", "write", "evaluate", "review", "deliver"],
  github_release: ["analyze", "research", "write", "evaluate", "review", "deliver"],
  github_issue: ["analyze", "research", "write", "review", "deliver"],
  default: ["trigger", "analyze", "execute", "evaluate", "review", "deliver"],
};

const label = (key: string) => key.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());

export function statusTone(status: string): "blue" | "green" | "amber" | "rose" | "slate" | "violet" | "cyan" {
  if (["completed", "active", "success", "delivered"].includes(status)) return "green";
  if (["failed", "rejected"].includes(status)) return "rose";
  if (["pending_review", "paused", "running"].includes(status)) return "amber";
  if (status === "pending_intervention") return "rose";
  if (["draft", "queued"].includes(status)) return "slate";
  if (["cancelled", "skipped", "archived"].includes(status)) return "violet";
  return "blue";
}

export function interventionStatusLabel(status: string): string {
  if (status === "pending") return "Awaiting decision";
  if (status === "approved") return "Approved";
  if (status === "denied") return "Denied";
  if (status === "guided") return "Guidance sent";
  if (status === "expired") return "Expired";
  return label(status);
}

export function filterWorkflows(items: WorkflowDefinition[], search: string): WorkflowDefinition[] {
  const term = search.trim().toLowerCase();
  if (!term) return items;
  return items.filter((item) => [item.name, item.slug, item.workflow_key, item.description ?? ""].some((value) => value.toLowerCase().includes(term)));
}

export function getWorkflowStages(value: Pick<WorkflowDefinition, "workflow_key"> & { stage_states?: Record<string, unknown> }): WorkflowStage[] {
  const states = value.stage_states ?? {};
  const keys = Object.keys(states).length ? Object.keys(states) : (STAGE_ORDER[value.workflow_key] ?? STAGE_ORDER.default);
  const ordered = [...new Set([...(STAGE_ORDER[value.workflow_key] ?? []), ...keys])];
  return ordered.map((key) => ({ key, label: label(key), status: String(states[key] ?? "queued") }));
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function formatRelativeTime(value: string | null | undefined, now = new Date()): string {
  if (!value) return "—";
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return "—";
  const seconds = Math.max(0, Math.floor((now.getTime() - timestamp.getTime()) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function definitionStatusLabel(status: DefinitionStatus): string {
  return label(status);
}
