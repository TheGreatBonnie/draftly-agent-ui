"use client";

import { Bot, CheckCircle2, Users } from "lucide-react";
import { useState } from "react";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import { Badge, Button, EmptyState, MetricCard, PageHeader, Skeleton } from "@/components/dashboard/ui";
import { useAgents } from "@/hooks/use-agents";
import { filterAgents } from "@/lib/agent-view-model";
import { AgentFilters } from "./agent-filters";
import { AgentList } from "./agent-list";

export function AgentsPage({ initialStatus = "all" }: { initialStatus?: string }) {
  const { agents, loading, error, retry } = useAgents();
  const [query, setQuery] = useState("");
  const [surface, setSurface] = useState("all");
  const [status, setStatus] = useState(initialStatus);
  const visible = filterAgents(agents, { query, surface, status });
  const surfaces = [...new Set(agents.map((agent) => agent.surface))].sort();
  const totalRuns = agents.reduce((sum, agent) => sum + agent.runs_7d, 0);
  const successRuns = agents.reduce((sum, agent) => sum + (agent.success_rate_7d === null ? 0 : agent.runs_7d * agent.success_rate_7d), 0);
  const measuredRuns = agents.reduce((sum, agent) => sum + (agent.success_rate_7d === null ? 0 : agent.runs_7d), 0);
  const successRate = measuredRuns ? `${Math.round(successRuns / measuredRuns * 100)}%` : "—";

  return <>
    <PageHeader title="Agents" subtitle="Live catalog and execution telemetry from the Draftly backend." actions={<Button onClick={retry}>Refresh</Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Agents" value={agents.length} sub={`${agents.filter((agent) => agent.availability === "enabled").length} enabled`} icon={<Users className="h-5 w-5" />} />
      <MetricCard label="Runs" value={totalRuns} sub="Last 7 days" icon={<Bot className="h-5 w-5" />} />
      <MetricCard label="Running" value={agents.filter((agent) => agent.last_run_status === "running").length} sub="Current telemetry" icon={<CheckCircle2 className="h-5 w-5" />} tone="green" />
      <MetricCard label="Success rate" value={successRate} sub="Measured runs only" icon={<CheckCircle2 className="h-5 w-5" />} tone="green" />
    </div>
    <div className="mt-4"><SectionTabs section="agents" /></div>
    <AgentFilters query={query} surface={surface} status={status} surfaces={surfaces} onQueryChange={setQuery} onSurfaceChange={setSurface} onStatusChange={setStatus} />
    {error && <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Unable to load agents: {error} <Button className="ml-2" onClick={retry}>Retry</Button></div>}
    {loading && agents.length === 0 ? <div className="mt-4 space-y-3"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div> : visible.length === 0 ? <div className="mt-4"><EmptyState icon={<Bot className="h-7 w-7" />} title={agents.length ? "No matching agents" : "No agents available"} description={agents.length ? "Try a different search or filter." : "The backend catalog returned no agents."} /></div> : <div className="mt-4"><AgentList agents={visible} /></div>}
    {agents.some((agent) => agent.id === "legacy") && <div className="mt-4"><Badge tone="violet">Legacy telemetry is shown separately where identity was not recorded.</Badge></div>}
  </>;
}
