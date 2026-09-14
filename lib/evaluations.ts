import type { EvaluationStatus } from "../api/evaluations.ts";

export interface EvaluationTrendPoint {
  date: string;
  average_score: number;
  run_count: number;
}

export interface EvaluationTrendDay {
  date: string;
  average_score: number | null;
  run_count: number;
}

const UTC_DAY_MS = 24 * 60 * 60 * 1_000;

export function buildEvaluationTrendDays(
  trend: EvaluationTrendPoint[],
  days: number,
  endDate = new Date(),
): EvaluationTrendDay[] {
  if (days <= 0) return [];
  const end = Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate(),
  );
  const start = end - (days - 1) * UTC_DAY_MS;
  const byDate = new Map(trend.map((point) => [point.date, point]));

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start + index * UTC_DAY_MS).toISOString().slice(0, 10);
    const point = byDate.get(date);
    return {
      date,
      average_score: point
        ? Math.max(0, Math.min(100, point.average_score))
        : null,
      run_count: point?.run_count ?? 0,
    };
  });
}

export function splitEvaluationTrendSegments<
  T extends { average_score: number | null },
>(values: T[]): T[][] {
  const segments: T[][] = [];
  let current: T[] = [];
  for (const value of values) {
    if (value.average_score === null) {
      if (current.length) segments.push(current);
      current = [];
    } else {
      current.push(value);
    }
  }
  if (current.length) segments.push(current);
  return segments;
}

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
