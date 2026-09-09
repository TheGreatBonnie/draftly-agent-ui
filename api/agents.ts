import { request } from "./client";
import type { AgentSummary } from "./types";

export async function listAgents(): Promise<{ agents: AgentSummary[] }> {
  return request("/agents");
}
