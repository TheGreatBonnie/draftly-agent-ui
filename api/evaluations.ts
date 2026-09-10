import { request } from "./client.ts";

export type EvaluationStatus = "queued" | "running" | "passed" | "failed" | "cancelled" | "skipped";

export interface EvaluationRunSummary {
  id: string;
  run_id: string;
  name: string;
  evaluation_type: string;
  datasets: string[];
  cases: number;
  passed: number;
  failed: number;
  score: number | null;
  status: EvaluationStatus;
  started_at: string | null;
  completed_at: string | null;
  duration_ms: number | null;
}

export interface EvaluationCaseResult {
  id: string;
  run_id: string;
  evaluation_id: string;
  dataset: string;
  case_id: string;
  metric: string;
  threshold: number | null;
  score: number | null;
  passed: boolean;
  reason: string;
  input: string | null;
  expected_output: string | null;
  actual_output: string | null;
  evidence: Array<Record<string, unknown>>;
  trace_id: string | null;
  duration_ms: number | null;
}

export interface EvaluationAggregateSummary {
  window_days: 1 | 7 | 14 | 30;
  average_score: number | null;
  total_runs: number;
  passed_runs: number;
  failed_runs: number;
  total_cases: number;
  pass_rate: number | null;
  trend: Array<{ date: string; average_score: number; run_count: number }>;
  by_metric: Array<{ metric: string; average_score: number; sample_count: number }>;
}

export interface EvaluationCatalog {
  datasets: Array<{ name: string; description: string; surface: string; case_count: number; version: string | null }>;
  evaluators: Array<{ key: string; display_name: string; description: string; threshold: number | null; version: string | null; enabled: boolean }>;
}

export interface EvaluationRunDetail {
  summary: EvaluationRunSummary;
  datasets: EvaluationCatalog["datasets"];
  evaluators: EvaluationCatalog["evaluators"];
  cases: EvaluationCaseResult[];
  next_cases_cursor: string | null;
  configuration: Record<string, unknown>;
  trace: Record<string, unknown> | null;
  artifacts: Array<Record<string, unknown>>;
  detail_available: boolean;
}

export interface EvaluationPage<T> {
  items: T[];
  total: number;
  next_cursor: string | null;
}

export async function listEvaluationRuns(options: { limit?: number; evaluationType?: string; cursor?: string } = {}) {
  const params = new URLSearchParams({ limit: String(options.limit ?? 50) });
  if (options.evaluationType) params.set("evaluation_type", options.evaluationType);
  if (options.cursor) params.set("cursor", options.cursor);
  return request<EvaluationPage<EvaluationRunSummary>>(`/evaluations?${params.toString()}`);
}

export async function getEvaluationRun(runId: string, options: { casesLimit?: number; casesCursor?: string } = {}) {
  const params = new URLSearchParams();
  if (options.casesLimit) params.set("cases_limit", String(options.casesLimit));
  if (options.casesCursor) params.set("cases_cursor", options.casesCursor);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request<EvaluationRunDetail>(`/evaluations/runs/${encodeURIComponent(runId)}${suffix}`);
}

export async function listEvaluationCases(runId: string, options: { limit?: number; cursor?: string } = {}) {
  const params = new URLSearchParams({ limit: String(options.limit ?? 50) });
  if (options.cursor) params.set("cursor", options.cursor);
  return request<EvaluationPage<EvaluationCaseResult>>(`/evaluations/runs/${encodeURIComponent(runId)}/cases?${params.toString()}`);
}

export async function getEvaluationSummary(days: 1 | 7 | 14 | 30 = 14) {
  return request<EvaluationAggregateSummary>(`/evaluations/summary?days=${days}`);
}

export async function getEvaluationCatalog() {
  return request<EvaluationCatalog>("/evaluations/catalog");
}

export async function startEvaluation(payload: { datasets?: string[]; live?: boolean; profile?: string }, idempotencyKey: string) {
  return request<{ run_id: string; status: "queued"; stream_ticket: string | null }>("/evaluations/run", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(payload),
  });
}
