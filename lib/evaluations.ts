import type { EvaluationStatus } from "../api/evaluations.ts";

export function evaluationScore(score: number | null): string {
  return score == null ? "—" : `${score.toFixed(1)}%`;
}

export function evaluationStatusLabel(status: string): string {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
}

export function evaluationTone(status: EvaluationStatus): "green" | "rose" | "amber" | "blue" {
  if (status === "passed") return "green";
  if (status === "failed") return "rose";
  if (status === "running") return "blue";
  return "amber";
}

export function formatEvaluationDate(value: string | null): string {
  if (!value) return "Unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unavailable" : date.toLocaleString();
}
