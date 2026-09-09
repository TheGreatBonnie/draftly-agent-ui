import { request } from "./client";
import type { RunSummary, RunStepSummary } from "./types";

export async function listRuns(): Promise<RunSummary[]> {
  const res = await request<{ items: RunSummary[] }>("/runs");
  return res.items;
}

export async function getRunSteps(runId: string): Promise<RunStepSummary[]> {
  const res = await request<{ items: RunStepSummary[] }>(`/runs/${runId}/steps`);
  return res.items;
}
