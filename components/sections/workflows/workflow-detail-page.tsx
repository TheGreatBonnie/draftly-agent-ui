"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Bot, CheckCircle2, GitBranch, GitPullRequest, Play, Settings2, ShieldCheck } from "lucide-react";
import { runWorkflow, setWorkflowStatus } from "@/api/workflows";
import { Badge, Button, Card, EmptyState, IconTile, PageHeader, Skeleton, Tabs } from "@/components/dashboard/ui";
import { useWorkflowDetail } from "@/hooks/use-workflow-detail";
import { formatRelativeTime, getWorkflowStages, statusTone } from "@/lib/workflow-view-model";

export function WorkflowDetailPage({ id }: { id: string }) {
  const { data, error, isLoading, isRefreshing, refresh } = useWorkflowDetail(id);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const workflow = data?.workflow;
  const recentRuns = data?.recent_runs.items ?? [];
  const stages = getWorkflowStages({ workflow_key: workflow?.workflow_key ?? "default" });

  async function changeStatus(next: "pause" | "resume") {
    setBusy(true); setActionError(null);
    try { await setWorkflowStatus(id, next); refresh(); } catch (err) { setActionError(err instanceof Error ? err.message : String(err)); } finally { setBusy(false); }
  }

  async function runNow() {
    setBusy(true); setActionError(null);
    try { await runWorkflow(id, { title: workflow?.name }); refresh(); } catch (err) { setActionError(err instanceof Error ? err.message : String(err)); } finally { setBusy(false); }
  }

  if (isLoading && !workflow) return <div className="space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-56 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (error && !workflow) return <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">Unable to load workflow: {error}</div>;
  if (!workflow) return <EmptyState icon={<GitPullRequest className="h-7 w-7" />} title="Workflow not found" description="This workflow may have been removed or is not available in the current organization." action={<Link href="/workflows"><Button>Back to workflows</Button></Link>} />;

  return <>
    <div className="mb-3"><Link href="/workflows" className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-brand"><ArrowLeft className="h-4 w-4" />Workflows</Link></div>
    <PageHeader title={workflow.name} subtitle={workflow.description || `${workflow.workflow_key} workflow`} actions={<><Button onClick={() => changeStatus(workflow.status === "paused" ? "resume" : "pause")} disabled={busy || workflow.status === "archived"}><Settings2 className="h-4 w-4" />{workflow.status === "paused" ? "Resume" : "Pause"}</Button><Button primary onClick={runNow} disabled={busy || workflow.status !== "active"}><Play className="h-4 w-4" />Run now</Button></>} />
    {actionError && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700" role="alert">{actionError}</div>}
    <Tabs active="Overview" items={["Overview", "Trigger", "Steps", "Agents", "Repositories", "Runs", "Evaluations", "Notifications", "Configuration"]} />
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_.8fr]"><div className="space-y-4"><Card className="p-5"><div className="flex items-center gap-3"><IconTile><GitPullRequest className="h-5 w-5" /></IconTile><div><h2 className="font-semibold">Workflow overview</h2><p className="text-sm text-foreground-muted">{String(workflow.trigger_config.event ?? "Configured trigger")}</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Info icon={<GitBranch className="h-4 w-4" />} label="Trigger" value={String(workflow.trigger_config.event ?? "Configured")} /><Info icon={<Bot className="h-4 w-4" />} label="Agents" value={`${Object.keys(workflow.agent_config).length || 0} configured`} /><Info icon={<ShieldCheck className="h-4 w-4" />} label="Review policy" value={workflow.review_config.required ? "Human review" : "Configured"} /><Info icon={<Settings2 className="h-4 w-4" />} label="Version" value={`v${workflow.version}`} /></div></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Workflow stages</h3><p className="text-xs text-foreground-muted">Persisted execution stages; private model reasoning is not exposed.</p></div><Badge tone={statusTone(workflow.status)}>{workflow.status}</Badge></div><div className="relative mt-5 space-y-4 before:absolute before:bottom-3 before:left-[19px] before:top-3 before:w-px before:bg-border">{stages.map((stage, index) => <div key={stage.key} className="relative flex gap-3"><div className={`z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${stage.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-surface-subtle text-foreground-muted"}`}>{stage.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs">{index + 1}</span>}</div><div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border p-3"><div className="flex-1"><div className="text-sm font-medium">{stage.label}</div><div className="text-xs text-foreground-muted">{stage.status}</div></div><Badge tone={statusTone(stage.status)}>{stage.status}</Badge></div></div>)}</div></Card></div><aside className="space-y-4"><Card className="p-4"><h3 className="font-semibold">Workflow metadata</h3><dl className="mt-4 grid grid-cols-2 gap-y-3 text-xs"><dt className="text-foreground-muted">Status</dt><dd><Badge tone={statusTone(workflow.status)}>{workflow.status}</Badge></dd><dt className="text-foreground-muted">Created</dt><dd>{formatRelativeTime(workflow.created_at)}</dd><dt className="text-foreground-muted">Updated</dt><dd>{formatRelativeTime(workflow.updated_at)}</dd><dt className="text-foreground-muted">Version</dt><dd>{workflow.version}</dd><dt className="text-foreground-muted">Runs</dt><dd>{data?.recent_runs.total ?? "—"}</dd></dl></Card><Card className="p-4"><div className="flex items-center justify-between"><h3 className="font-semibold">Recent runs</h3><Button onClick={refresh} disabled={isRefreshing}>Refresh</Button></div>{recentRuns.length === 0 ? <p className="mt-3 text-xs text-foreground-muted">No runs yet.</p> : recentRuns.map((run) => <Link key={run.id} href={`/workflows/${encodeURIComponent(id)}/runs/${encodeURIComponent(run.id)}`} className="mt-3 flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-surface-subtle"><Play className="h-4 w-4 text-foreground-muted" /><div className="flex-1"><div className="text-sm font-medium">{run.title || run.id}</div><div className="text-xs text-foreground-muted">{formatRelativeTime(run.created_at)}</div></div><Badge tone={statusTone(run.status)}>{run.status}</Badge></Link>)}</Card></aside></div>
  </>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-border p-3"><div className="text-brand">{icon}</div><div className="mt-2 text-xs text-foreground-muted">{label}</div><div className="mt-1 text-sm font-medium">{value}</div></div>; }
