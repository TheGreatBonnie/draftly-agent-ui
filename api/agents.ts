import { request } from "./client.ts";
import type { AgentSummary } from "./types.ts";

export async function listAgents(options?: RequestInit): Promise<{ agents: AgentSummary[] }> {
  return request("/agents", options);
}

export interface AgentDetailResponse {
  agent: AgentSummary;
  metrics: { window_days: number; runs: number; success_rate: number | null };
  tools: string[];
  recent_runs: import("./types").RunSummary[];
}

export async function getAgent(agentId: string): Promise<AgentDetailResponse> {
  return request(`/agents/${encodeURIComponent(agentId)}`);
}

export async function listAgentRuns(
  agentId: string,
  options: { limit?: number; cursor?: string } = {},
): Promise<{ items: import("./types").RunSummary[]; next_cursor: string | null }> {
  const params = new URLSearchParams({ limit: String(options.limit ?? 50) });
  if (options.cursor) params.set("cursor", options.cursor);
  return request(`/agents/${encodeURIComponent(agentId)}/runs?${params.toString()}`);
}
