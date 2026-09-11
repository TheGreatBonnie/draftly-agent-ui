import { request } from "./client.ts";

export interface RunRecord {
  run_id: string;
  source: string;
  event_type: string;
  org_id: string;
  status: string;
  error: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface RunStep {
  seq: number;
  kind: string;
  name: string;
  status: string;
  duration_ms: number | null;
  detail: Record<string, unknown> | null;
}

export interface ReviewSummary {
  id: string;
  org_id: string;
  run_id: string;
  workflow: string;
  tool_name: string;
  tool_args: Record<string, unknown>;
  action_description: string | null;
  status: string;
  decision: string | null;
  decision_comment: string | null;
  decided_at: string | null;
  created_at: string | null;
  expires_at: string | null;
  interrupt_id: string | null;
  // Task 10 structured fields (optional until backend deployed)
  detail?: Record<string, unknown> | null;
  display?: ReviewDisplay | null;
  pr?: {
    title?: string;
    trigger_label?: string;
    actor?: string;
    owner?: string;
    repo?: string;
    issue_number?: number;
  } | null;
}

export interface ReviewDisplayFile {
  path: string;
  action: string | null;
  original_content: string | null;
  proposed_content: string | null;
  original_content_available: boolean;
}

export interface ReviewEvaluationDimension {
  name?: string;
  value?: number | null;
  [key: string]: unknown;
}

export interface ReviewEvidenceItem {
  id?: string;
  title?: string;
  detail?: string;
  count?: number | string;
  url?: string | null;
  [key: string]: unknown;
}

export interface ReviewDisplayEvaluation {
  overall_score: number | null;
  dimensions: ReviewEvaluationDimension[];
  reasons: string[];
  count: number | null;
}

export interface ReviewDisplay {
  title: string | null;
  reference: string | null;
  description: string | null;
  repository: string | null;
  files: ReviewDisplayFile[];
  change_type: string | null;
  risk: string | null;
  evaluation: ReviewDisplayEvaluation;
  evidence: ReviewEvidenceItem[];
  github_url: string | null;
  updated_at: string | null;
}

export interface ReviewListCounts {
  pending: number;
  urgent: number;
  approved: number;
  needs_changes: number;
  rejected: number;
}

export interface ReviewListResponse {
  items: ReviewSummary[];
  total?: number;
  counts?: ReviewListCounts;
  next_cursor?: string | null;
}

export interface ReviewListOptions {
  status?: string;
  limit?: number;
  cursor?: string;
}

export interface ModelPerformance {
  model_name: string;
  task_type: string;
  sample_count: number | null;
  success_rate: number | null;
  p50_latency_ms: number | null;
  p95_latency_ms: number | null;
  quality_ema: number | null;
}

export interface MetricsSnapshot {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  timings: Record<string, Record<string, number>>;
}

export async function listRuns(
  status?: string,
  limit = 50,
): Promise<{ items: RunRecord[] }> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (status) params.set("status", status);
  return request(`/runs?${params.toString()}`);
}

export async function getRun(runId: string): Promise<{ run: RunRecord }> {
  return request(`/runs/${encodeURIComponent(runId)}`);
}

export async function getRunSteps(
  runId: string,
): Promise<{ items: RunStep[] }> {
  return request(`/runs/${encodeURIComponent(runId)}/steps`);
}

export async function listReviews(
  options?: ReviewListOptions,
): Promise<ReviewListResponse>;
export async function listReviews(
  status?: string,
  limit?: number,
): Promise<ReviewListResponse>;
export async function listReviews(
  optionsOrStatus: ReviewListOptions | string = {},
  positionalLimit = 100,
): Promise<ReviewListResponse> {
  const options = typeof optionsOrStatus === "string"
    ? { status: optionsOrStatus, limit: positionalLimit }
    : optionsOrStatus;
  const params = new URLSearchParams({ limit: String(options.limit ?? 100) });
  if (options.status) params.set("status", options.status);
  if (options.cursor) params.set("cursor", options.cursor);
  return request(`/reviews?${params.toString()}`);
}

export async function getReview(reviewId: string): Promise<{ review: ReviewSummary }> {
  return request(`/reviews/${encodeURIComponent(reviewId)}`);
}

// Run-id alias — uses Task 10's /by-run endpoint when available, falls back to list filter.
export async function getReviewByRunId(runId: string): Promise<{ review: ReviewSummary }> {
  try {
    return await request<{ review: ReviewSummary }>(`/reviews/by-run/${encodeURIComponent(runId)}`);
  } catch (err) {
    // Fallback until Task 10 alias is deployed: scan the pending list
    const { items } = await listReviews(undefined, 200);
    const found = (items as ReviewSummary[]).find((r) => r.run_id === runId);
    if (!found) throw err;
    return { review: found };
  }
}

export async function getMetricsSnapshot(): Promise<MetricsSnapshot> {
  return request("/metrics/snapshot");
}

export async function getRoutingDecisions(
  limit = 100,
): Promise<{ items: Record<string, unknown>[] }> {
  return request(`/observability/routing-decisions?limit=${limit}`);
}

export async function getModelPerformance(): Promise<{
  items: ModelPerformance[];
}> {
  return request("/observability/model-performance");
}

export type JobStatus = {
  job_id: string;
  task_name: string;
  status: "queued" | "started" | "finished" | "failed";
  enqueued_at: string;
  started_at?: string;
  completed_at?: string;
  result?: unknown;
  error?: string;
  attempts: number;
};

export async function getActiveJobs(): Promise<{
  items: { job_id: string }[];
}> {
  return request("/jobs");
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  return request<JobStatus>(`/jobs/${jobId}`);
}

export async function listActiveJobs(): Promise<JobStatus[]> {
  const res = await request<{ items: JobStatus[] }>("/jobs");
  return res.items;
}

export type {
  DefinitionStatus,
  RunStatus,
  WorkflowDefinition,
  WorkflowListResponse,
  WorkflowRun,
  WorkflowRunListResponse,
  WorkflowTemplate,
} from "./workflows.ts";

export interface EvaluationItem {
  id: string;
  org_id: string;
  evaluation_type: string | null;
  target_id: string | null;
  score: number | null;
  status: string;
  metrics: Record<string, unknown>;
  failures: Record<string, unknown>[];
  started_at: string | null;
  completed_at: string | null;
  target_type?: string | null;
  trace_id?: string | null;
}

export async function listEvaluations(
  options: { limit?: number; evaluation_type?: string; target_id?: string } = {},
): Promise<{ items: EvaluationItem[] }> {
  const params = new URLSearchParams({ limit: String(options.limit ?? 50) });
  if (options.evaluation_type) params.set("evaluation_type", options.evaluation_type);
  if (options.target_id) params.set("target_id", options.target_id);
  return request(`/evaluations?${params.toString()}`);
}

export async function getEvaluation(
  evaluationId: string,
): Promise<{ item: EvaluationItem }> {
  return request(`/evaluations/${encodeURIComponent(evaluationId)}`);
}
