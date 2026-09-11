import { request } from "./client.ts";

export type DefinitionStatus = "active" | "paused" | "draft" | "archived";
export type RunStatus = "queued" | "running" | "pending_review" | "pending_intervention" | "completed" | "failed" | "cancelled" | "skipped";
export type InterventionAction = "approve" | "deny" | "guide";

export interface PendingIntervention {
  interrupt_id: string;
  status: string;
  phase: string | null;
  role: string | null;
  rule: string | null;
  reason: string | null;
  agent_id: string | null;
  node_id: string | null;
  tool_name: string | null;
  created_at: string | null;
  expires_at: string | null;
}

export interface WorkflowDefinition {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description: string | null;
  workflow_key: string;
  status: DefinitionStatus;
  version: number;
  trigger_config: Record<string, unknown>;
  condition_config: Record<string, unknown>;
  agent_config: Record<string, unknown>;
  repository_config: Record<string, unknown>;
  evaluation_config: Record<string, unknown>;
  review_config: Record<string, unknown>;
  delivery_config: Record<string, unknown>;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface WorkflowRun {
  id: string;
  definition_id: string | null;
  source: string;
  source_event_id: string | null;
  event_type: string | null;
  title: string | null;
  repository: string | null;
  actor: string | null;
  target: Record<string, unknown> | null;
  status: RunStatus;
  current_stage: string | null;
  stage_states: Record<string, unknown>;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  error: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  pending_interventions?: PendingIntervention[];
}

export interface WorkflowTemplate {
  id: string;
  org_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  workflow_key: string;
  defaults: Record<string, unknown>;
  is_system: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface WorkflowStage {
  key: string;
  label: string;
  status: string;
}

export interface WorkflowListResponse {
  items: WorkflowDefinition[];
  summary: {
    definitions?: Record<string, number>;
    runs?: Record<string, number>;
    [key: string]: unknown;
  };
  total: number;
  next_cursor: string | null;
}

export interface WorkflowRunListResponse {
  items: WorkflowRun[];
  total: number;
  next_cursor: string | null;
}

export interface WorkflowDefinitionInput {
  name: string;
  slug: string;
  workflow_key: string;
  description?: string | null;
  status?: DefinitionStatus;
  trigger_config?: Record<string, unknown>;
  condition_config?: Record<string, unknown>;
  agent_config?: Record<string, unknown>;
  repository_config?: Record<string, unknown>;
  evaluation_config?: Record<string, unknown>;
  review_config?: Record<string, unknown>;
  delivery_config?: Record<string, unknown>;
}

function query(options: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}

export function listWorkflows(options: { status?: DefinitionStatus; workflowKey?: string; limit?: number; cursor?: string; days?: number } = {}): Promise<WorkflowListResponse> {
  return request<WorkflowListResponse>(`/workflows${query({ status: options.status, workflow_key: options.workflowKey, limit: options.limit, cursor: options.cursor, days: options.days })}`);
}

export function getWorkflow(id: string): Promise<{ workflow: WorkflowDefinition; recent_runs: WorkflowRunListResponse }> {
  return request(`/workflows/${encodeURIComponent(id)}`);
}

export function createWorkflow(payload: WorkflowDefinitionInput): Promise<{ workflow: WorkflowDefinition }> {
  return request("/workflows", { method: "POST", body: JSON.stringify(payload) });
}

export function updateWorkflow(id: string, payload: Partial<WorkflowDefinitionInput>): Promise<{ workflow: WorkflowDefinition }> {
  return request(`/workflows/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function setWorkflowStatus(id: string, next: "pause" | "resume"): Promise<{ workflow: WorkflowDefinition }> {
  return request(`/workflows/${encodeURIComponent(id)}/${next}`, { method: "POST" });
}

export function listWorkflowRuns(options: { definitionId?: string; status?: RunStatus; limit?: number; cursor?: string } = {}): Promise<WorkflowRunListResponse> {
  return request(`/workflow-runs${query({ definition_id: options.definitionId, status: options.status, limit: options.limit, cursor: options.cursor })}`);
}

export function getWorkflowRun(id: string): Promise<{ run: WorkflowRun }> {
  return request(`/workflow-runs/${encodeURIComponent(id)}`);
}

export function respondToIntervention(
  runId: string,
  interruptId: string,
  payload: { action: InterventionAction; message?: string; idempotency_key: string },
): Promise<{ intervention_id: string | null; interrupt_id: string; status: string; resolver: string | null; response_message: string | null; run_status: string | null }> {
  return request(`/workflow-runs/${encodeURIComponent(runId)}/interventions/${encodeURIComponent(interruptId)}/respond`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getWorkflowRunSteps(id: string): Promise<{ items: Array<Record<string, unknown>> }> {
  return request(`/workflow-runs/${encodeURIComponent(id)}/steps`);
}

export function getWorkflowRunArtifacts(id: string): Promise<{ items: Array<Record<string, unknown>> }> {
  return request(`/workflow-runs/${encodeURIComponent(id)}/artifacts`);
}

export function runWorkflow(definitionId: string, payload: { title?: string; input?: Record<string, unknown>; target?: Record<string, unknown> }, idempotencyKey?: string): Promise<{ run: WorkflowRun }> {
  return request(`/workflows/${encodeURIComponent(definitionId)}/runs`, {
    method: "POST",
    headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    body: JSON.stringify(payload),
  });
}

export function cancelWorkflowRun(id: string): Promise<{ run: WorkflowRun }> {
  return request(`/workflow-runs/${encodeURIComponent(id)}/cancel`, { method: "POST" });
}

export function retryWorkflowRun(id: string): Promise<{ run: WorkflowRun }> {
  return request(`/workflow-runs/${encodeURIComponent(id)}/retry`, { method: "POST" });
}

export function issueWorkflowRunTicket(id: string): Promise<{ ticket: string }> {
  return request(`/workflow-runs/${encodeURIComponent(id)}/stream-ticket`, { method: "POST" });
}

export function listWorkflowTemplates(limit = 50): Promise<{ items: WorkflowTemplate[] }> {
  return request(`/workflow-templates?limit=${limit}`);
}
