"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileCheck2, GitPullRequest, Play, Plus, Workflow as WorkflowIcon } from "lucide-react";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import { Badge, Button, Card, EmptyState, IconTile, MetricCard, PageHeader, SearchBox, Skeleton } from "@/components/dashboard/ui";
import { useWorkflows } from "@/hooks/use-workflows";
import { filterWorkflows, formatDuration, formatRelativeTime, statusTone } from "@/lib/workflow-view-model";

export function WorkflowsPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading, isRefreshing, refresh, templates } = useWorkflows();
  const items = useMemo(() => filterWorkflows(data?.items ?? [], search), [data?.items, search]);
  const runSummary = data?.summary.runs ?? {};
  const definitionSummary = data?.summary.definitions ?? {};

  return (
    <>
      <PageHeader title="Workflows" subtitle="Automate documentation for your entire development lifecycle." actions={<Link href="/workflows/new"><Button primary><Plus className="h-4 w-4" />New workflow</Button></Link>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active workflows" value={definitionSummary.active ?? "—"} sub="Current organization" icon={<Play className="h-5 w-5" />} />
        <MetricCard label="Total runs" value={runSummary.total ?? "—"} sub={`Last ${runSummary.days ?? 30} days`} icon={<WorkflowIcon className="h-5 w-5" />} />
        <MetricCard label="Success rate" value={runSummary.success_rate === undefined ? "—" : `${runSummary.success_rate}%`} sub="Completed runs" tone="green" icon={<FileCheck2 className="h-5 w-5" />} />
        <MetricCard label="Avg. run time" value={formatDuration(Number(runSummary.avg_duration_seconds ?? NaN))} sub="Completed runs" tone="amber" icon={<WorkflowIcon className="h-5 w-5" />} />
      </div>
      <div className="mt-4"><SectionTabs section="workflows" /></div>
      <div className="mt-4 flex min-w-0 flex-wrap gap-2"><SearchBox className="min-w-[220px] flex-1" placeholder="Search workflows..." value={search} onChange={setSearch} /><Button onClick={refresh} disabled={isRefreshing}>Refresh</Button></div>
      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">Unable to load workflows: {error}</div>}
      {isLoading && !data ? <div className="mt-4 space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div> : items.length === 0 ? <div className="mt-4"><EmptyState icon={<WorkflowIcon className="h-7 w-7" />} title={search ? "No matching workflows" : "No workflows yet"} description={search ? "Try a different search term." : "Create a workflow or start from a template to automate documentation."} action={!search ? <Link href="/workflows/new"><Button primary>Create workflow</Button></Link> : undefined} /></div> : <div className="mt-4 grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_330px]"><Card className="min-w-0 overflow-hidden"><div className="divide-y divide-border">{items.map((workflow) => <div key={workflow.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 gap-3"><IconTile tone={workflow.workflow_key.includes("github") ? "blue" : "violet"}><GitPullRequest className="h-5 w-5" /></IconTile><div className="min-w-0"><Link href={`/workflows/${encodeURIComponent(workflow.id)}`} className="text-sm font-semibold hover:text-brand">{workflow.name}</Link><div className="mt-1 text-xs text-foreground-muted">{workflow.description || workflow.slug}</div><div className="mt-2 flex flex-wrap gap-1"><Badge>{workflow.workflow_key}</Badge><Badge tone={statusTone(workflow.status)}>{workflow.status}</Badge></div></div></div><div className="grid grid-cols-2 gap-3 text-xs sm:flex-1 sm:min-w-0"><div><div className="text-foreground-muted">Trigger</div><div className="mt-1">{String(workflow.trigger_config.event ?? "Configured trigger")}</div></div><div><div className="text-foreground-muted">Updated</div><div className="mt-1">{formatRelativeTime(workflow.updated_at)}</div></div></div></div>)}</div></Card><aside className="min-w-0 space-y-4"><Card className="p-4"><h3 className="font-semibold">Selected workflow</h3><div className="mt-4 text-sm text-foreground-muted">{items[0]?.description || "No description provided."}</div><dl className="mt-4 grid grid-cols-2 gap-y-3 text-xs"><dt className="text-foreground-muted">Status</dt><dd><Badge tone={statusTone(items[0]?.status ?? "")}>{items[0]?.status ?? "—"}</Badge></dd><dt className="text-foreground-muted">Updated</dt><dd>{formatRelativeTime(items[0]?.updated_at)}</dd><dt className="text-foreground-muted">Version</dt><dd>{items[0]?.version ?? "—"}</dd></dl><Link href={items[0] ? `/workflows/${encodeURIComponent(items[0].id)}` : "/workflows/new"}><Button className="mt-4 w-full">Open workflow</Button></Link></Card><Card className="p-4"><h3 className="font-semibold">Workflow templates</h3>{templates.items.length === 0 ? <p className="mt-3 text-xs text-foreground-muted">No templates available.</p> : templates.items.slice(0, 3).map((template) => <div key={template.id} className="mt-3 flex items-center justify-between text-sm"><span>{template.name}</span><Link href={`/workflows/new?template=${encodeURIComponent(template.id)}`} className="text-xs font-medium text-brand">Use →</Link></div>)}</Card></aside></div>}
    </>
  );
}
