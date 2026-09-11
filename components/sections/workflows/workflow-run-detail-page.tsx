"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, CircleAlert, Clock3, RotateCcw, Square } from "lucide-react";
import { cancelWorkflowRun, retryWorkflowRun } from "@/api/workflows";
import { Badge, Button, Card, EmptyState, PageHeader, Skeleton } from "@/components/dashboard/ui";
import { useWorkflowRun } from "@/hooks/use-workflow-run";
import { formatRelativeTime, statusTone } from "@/lib/workflow-view-model";

export function WorkflowRunDetailPage({ workflowId, runId }: { workflowId: string; runId: string }) {
  const { data, error, isLoading, live, steps, artifacts, refresh } = useWorkflowRun(runId);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = data?.run;

  async function action(kind: "cancel" | "retry") {
    setBusy(true);
    setActionError(null);
    try {
      if (kind === "cancel") await cancelWorkflowRun(runId);
      else await retryWorkflowRun(runId);
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  if (isLoading && !run) return <div className="space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-80 w-full" /></div>;
  if (error && !run) return <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">Unable to load run: {error}</div>;
  if (!run) return <EmptyState icon={<CircleAlert className="h-7 w-7" />} title="Run not found" description="This execution is unavailable in the current organization." action={<Link href={`/workflows/${encodeURIComponent(workflowId)}`}><Button>Back to workflow</Button></Link>} />;

  const terminal = ["completed", "failed", "cancelled", "skipped"].includes(run.status);
  return (
    <>
      <div className="mb-3"><Link href={`/workflows/${encodeURIComponent(workflowId)}`} className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-brand"><ArrowLeft className="h-4 w-4" />Workflow</Link></div>
      <PageHeader title={run.title || run.id} subtitle={`${run.repository || "No repository"} · ${run.actor || "Unknown actor"}`} actions={<><Badge tone={statusTone(run.status)}>{run.status}</Badge>{!terminal && <Button danger onClick={() => action("cancel")} disabled={busy}><Square className="h-4 w-4" />Cancel</Button>}{terminal && run.status !== "completed" && <Button onClick={() => action("retry")} disabled={busy}><RotateCcw className="h-4 w-4" />Retry</Button>}</>} />
      {actionError && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700" role="alert">{actionError}</div>}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_.8fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold">Execution timeline</h2><p className="text-xs text-foreground-muted">{live.status === "live" ? "Live updates connected" : "Persisted execution state"}</p></div><Button onClick={refresh}>Refresh</Button></div>
          <div className="relative mt-5 space-y-3 before:absolute before:bottom-3 before:left-4 before:top-3 before:w-px before:bg-border">
            {steps.length === 0 ? <p className="text-sm text-foreground-muted">No execution steps recorded yet.</p> : steps.map((step, index) => <div key={`${String(step.seq)}-${String(step.name)}-${index}`} className="relative flex gap-3"><div className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div><div className="min-w-0 flex-1 rounded-xl border border-border p-3"><div className="flex items-center justify-between gap-3"><span className="text-sm font-medium">{String(step.name)}</span><Badge tone={statusTone(String(step.status))}>{String(step.status)}</Badge></div>{step.detail !== undefined && <p className="mt-1 truncate text-xs text-foreground-muted">{typeof step.detail === "object" ? JSON.stringify(step.detail) : String(step.detail)}</p>}</div></div>)}
          </div>
        </Card>
        <aside className="space-y-4">
          <Card className="p-4"><h3 className="font-semibold">Run metadata</h3><dl className="mt-4 grid grid-cols-2 gap-y-3 text-xs"><dt className="text-foreground-muted">Run ID</dt><dd className="truncate">{run.id}</dd><dt className="text-foreground-muted">Started</dt><dd>{formatRelativeTime(run.started_at || run.created_at)}</dd><dt className="text-foreground-muted">Completed</dt><dd>{formatRelativeTime(run.completed_at)}</dd><dt className="text-foreground-muted">Current stage</dt><dd>{run.current_stage || "—"}</dd><dt className="text-foreground-muted">Source</dt><dd>{run.source}</dd></dl></Card>
          <Card className="p-4"><h3 className="font-semibold">Artifacts</h3>{artifacts.length === 0 ? <p className="mt-3 text-xs text-foreground-muted">No artifacts recorded.</p> : artifacts.map((artifact, index) => <div key={index} className="mt-3 flex items-center gap-2 text-sm"><Clock3 className="h-4 w-4 text-foreground-muted" />{String(artifact.status ?? "Artifact")}</div>)}</Card>
          {run.error && <Card className="border-rose-200 p-4"><h3 className="font-semibold text-rose-700">Failure detail</h3><p className="mt-2 text-sm text-rose-700">{run.error}</p></Card>}
        </aside>
      </div>
    </>
  );
}
