import { request } from "./client.ts";
import type { RunSummary, RunStepSummary } from "./types.ts";

export async function listRuns(options: { status?: string; limit?: number } = {}): Promise<{ items: RunSummary[] }> {
  const params = new URLSearchParams({ limit: String(options.limit ?? 50) });
  if (options.status) params.set("status", options.status);
  return request<{ items: RunSummary[] }>(`/runs?${params.toString()}`);
}

export async function getRunSteps(runId: string): Promise<RunStepSummary[]> {
  const res = await request<{ items: RunStepSummary[] }>(`/runs/${encodeURIComponent(runId)}/steps`);
  return res.items;
}
