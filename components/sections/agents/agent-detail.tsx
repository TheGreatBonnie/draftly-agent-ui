import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Badge, Button, Card, IconTile, PageHeader } from "@/components/dashboard/ui";
import type { AgentDetailResponse } from "@/api/agents";
import type { RunStepSummary } from "@/api/types";
import { formatAgentTimestamp, formatSuccessRate, statusTone } from "@/lib/agent-view-model";
import { agentIcon, surfaceTone } from "./agent-icons";

export function AgentDetail({ data, steps, streamStatus, selectedRunId, onSelectRun }: { data: AgentDetailResponse; steps: RunStepSummary[]; streamStatus: string; selectedRunId: string | null; onSelectRun: (runId: string) => void }) {
  const agent = data.agent;
  const Icon = agentIcon(agent.surface);
  return <>
    <Link href="/agents" className="mb-3 inline-flex items-center gap-1 text-sm text-foreground-muted"><ArrowLeft className="h-4 w-4" />Agents</Link>
    <PageHeader title={agent.name} subtitle={agent.description} actions={<Badge tone={statusTone(agent.last_run_status)}>{agent.last_run_status}</Badge>} />
    <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
      <div className="space-y-4">
        <Card className="p-5"><div className="flex items-start gap-4"><IconTile size="lg" tone={surfaceTone(agent.surface)}><Icon className="h-7 w-7" /></IconTile><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold">{agent.name}</h2><Badge tone="slate">{agent.surface}</Badge></div><p className="mt-1 text-sm text-foreground-muted">Stable id: {agent.id}</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Info label="Runs (7d)" value={String(agent.runs_7d)} /><Info label="Success rate" value={formatSuccessRate(agent.success_rate_7d)} /><Info label="Last run" value={formatAgentTimestamp(agent.last_run_at)} /></div></Card>
        <Card className="p-5"><h3 className="font-semibold">Tools and capabilities</h3><div className="mt-4 flex flex-wrap gap-2">{data.tools.length ? data.tools.map((tool) => <Badge key={tool}>{tool}</Badge>) : <p className="text-sm text-foreground-muted">No tools declared.</p>}</div></Card>
        <Card className="p-5"><div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">Selected run timeline</h3><p className="text-xs text-foreground-muted">Historical steps are hydrated first; live updates are merged by sequence.</p></div><Badge tone={streamStatus === "live" ? "green" : "slate"}>{streamStatus}</Badge></div>{!selectedRunId ? <p className="mt-4 text-sm text-foreground-muted">No runs yet.</p> : steps.length === 0 ? <p className="mt-4 text-sm text-foreground-muted">No steps recorded for this run.</p> : <div className="mt-5 space-y-3">{steps.map((step) => <Step key={`${step.seq}-${step.name}`} step={step} />)}</div>}</Card>
      </div>
      <aside className="space-y-4"><Card className="p-4"><h3 className="font-semibold">Recent runs</h3>{data.recent_runs.length === 0 ? <p className="mt-3 text-sm text-foreground-muted">No runs yet.</p> : data.recent_runs.map((run) => <button type="button" key={run.run_id} onClick={() => onSelectRun(run.run_id)} className={`mt-3 flex w-full items-center gap-3 rounded-xl border p-3 text-left ${run.run_id === selectedRunId ? "border-brand bg-surface-subtle" : "border-border"}`}><Circle className="h-4 w-4 text-foreground-muted" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{run.event_type || run.run_id}</span><span className="block text-xs text-foreground-muted">{formatAgentTimestamp(run.started_at)}</span></span><Badge tone={statusTone(run.status)}>{run.status}</Badge></button>)}</Card><Card className="p-4"><h3 className="font-semibold">Configuration</h3><p className="mt-3 text-sm text-foreground-muted">Runtime model and private prompt configuration are intentionally not exposed by the backend.</p><Link href="/agents" className="mt-4 block"><Button className="w-full">Back to agents</Button></Link></Card></aside>
    </div>
  </>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-border p-3"><div className="text-xs text-foreground-muted">{label}</div><div className="mt-1 text-sm font-medium">{value}</div></div>; }
function Step({ step }: { step: RunStepSummary }) { const running = step.status.toLowerCase() === "running"; const failed = step.status.toLowerCase() === "failed"; return <div className="flex gap-3 rounded-xl border border-border p-3"><div className="mt-0.5">{running ? <Loader2 className="h-4 w-4 animate-spin text-blue-600" /> : failed ? <Circle className="h-4 w-4 text-rose-600" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><span className="truncate text-sm font-medium">{step.name}</span><Badge tone={statusTone(step.status)}>{step.status}</Badge></div><div className="mt-1 text-xs text-foreground-muted">{step.kind}{step.duration_ms === null || step.duration_ms === undefined ? "" : ` · ${step.duration_ms}ms`}</div></div></div>; }
