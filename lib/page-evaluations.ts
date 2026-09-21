export type PageEvaluationStatus =
  | "pending"
  | "writing"
  | "evaluating"
  | "revising"
  | "passed"
  | "awaiting_human_review"
  | "failed";

export interface PageEvaluationSummary {
  pageId: string;
  path: string;
  status: PageEvaluationStatus;
  version: number;
  attempts: number;
  score: number | null;
  failedMetrics: string[];
  feedback: string[];
  escalationReason: string | null;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function integer(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "").map((item) => item.trim());
}

function normalizedScore(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value >= 0 && value <= 1 ? value * 100 : value;
}

export function normalizePageResults(value: unknown): PageEvaluationSummary[] {
  if (!Array.isArray(value)) return [];
  const pages: PageEvaluationSummary[] = [];
  for (const raw of value) {
    const item = record(raw);
    const path = text(item.path) ?? text(item.page_id);
    if (!path) continue;
    pages.push({
      pageId: text(item.page_id) ?? path,
      path,
      status: (text(item.status) ?? "pending") as PageEvaluationStatus,
      version: integer(item.version),
      attempts: integer(item.attempts),
      score: normalizedScore(item.score),
      failedMetrics: strings(item.failed_metrics),
      feedback: strings(item.feedback),
      escalationReason: text(item.escalation_reason),
    });
  }
  return pages;
}

function titleCase(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  writing: "Writing",
  evaluating: "Evaluating",
  revising: "Revising",
  passed: "Passed",
  awaiting_human_review: "Awaiting human review",
  failed: "Failed",
};

export function pageStatusLabel(status: string): string {
  const key = status.toLowerCase();
  return STATUS_LABELS[key] ?? titleCase(key);
}

export type PageStatusTone = "green" | "amber" | "rose" | "slate" | "blue";

export function pageStatusTone(status: string): PageStatusTone {
  const key = status.toLowerCase();
  if (key === "passed") return "green";
  if (key === "failed") return "rose";
  if (key === "awaiting_human_review") return "amber";
  if (key === "pending") return "slate";
  return "blue";
}

export interface PageDetailRow {
  label: string;
  value: string;
}

export function pageScoreLabel(score: number | null): string {
  if (score === null || !Number.isFinite(score)) return "—";
  return `${Math.round(score)}%`;
}

export function pageDetailRows(page: PageEvaluationSummary): PageDetailRow[] {
  return [
    { label: "Version", value: String(page.version) },
    { label: "Attempt", value: String(page.attempts) },
    { label: "Score", value: pageScoreLabel(page.score) },
    { label: "Failed metrics", value: page.failedMetrics.length ? page.failedMetrics.join(", ") : "None" },
    { label: "Feedback", value: page.feedback.length ? page.feedback.join(" · ") : "None" },
    { label: "Escalation reason", value: page.escalationReason ?? "None" },
  ];
}