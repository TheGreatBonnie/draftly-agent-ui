import Link from "next/link";
import { Badge, Card, IconTile } from "@/components/dashboard/ui";
import type { AgentSummary } from "@/api/types";
import { formatAgentTimestamp, formatSuccessRate, statusTone } from "@/lib/agent-view-model";
import { agentIcon, surfaceTone } from "./agent-icons";

export function AgentList({ agents }: { agents: AgentSummary[] }) {
  return <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
    {agents.map((agent) => {
      const Icon = agentIcon(agent.surface);
      return <Card key={agent.id} className="min-w-0 p-4">
        <div className="flex items-start gap-3">
          <IconTile tone={surfaceTone(agent.surface)}><Icon className="h-5 w-5" /></IconTile>
          <div className="min-w-0 flex-1">
            <Link href={`/agents/${encodeURIComponent(agent.id)}`} className="truncate text-sm font-semibold hover:text-brand">{agent.name}</Link>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge tone={statusTone(agent.last_run_status)}>{agent.last_run_status}</Badge>
              <Badge tone="slate">{agent.surface}</Badge>
            </div>
          </div>
        </div>
        <p className="mt-4 min-h-[48px] text-xs leading-5 text-foreground-muted">{agent.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">{agent.tools.length ? agent.tools.slice(0, 6).map((tool) => <Badge key={tool}>{tool}</Badge>) : <span className="text-xs text-foreground-muted">No tools declared</span>}</div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs text-foreground-muted">
          <span>{agent.runs_7d} runs · {formatSuccessRate(agent.success_rate_7d)}</span>
          <span className="truncate text-right">{formatAgentTimestamp(agent.last_run_at)}</span>
        </div>
      </Card>;
    })}
  </div>;
}
