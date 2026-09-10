import type { AgentSummary } from "@/api/types";

export type AgentFilter = { query: string; surface: string; status: string };

export function filterAgents(agents: AgentSummary[], filter: AgentFilter): AgentSummary[] {
  const query = filter.query.trim().toLowerCase();
  return agents.filter((agent) => {
    const matchesQuery = !query || [agent.name, agent.description, agent.role, ...agent.tools]
      .join(" ").toLowerCase().includes(query);
    const matchesSurface = filter.surface === "all" || agent.surface === filter.surface;
    const matchesStatus = filter.status === "all" || agent.last_run_status === filter.status;
    return matchesQuery && matchesSurface && matchesStatus;
  });
}

export function formatAgentTimestamp(value: string | null): string {
  if (!value) return "No runs yet";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString();
}

export function formatSuccessRate(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

export function statusTone(status: string): "blue" | "green" | "amber" | "rose" | "violet" | "slate" {
  if (status === "running") return "blue";
  if (status === "completed") return "green";
  if (status === "failed") return "rose";
  if (status === "idle") return "slate";
  return "violet";
}
