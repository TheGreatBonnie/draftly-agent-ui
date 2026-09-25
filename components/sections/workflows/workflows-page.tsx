"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileCheck2, Play, Plus, Workflow as WorkflowIcon } from "lucide-react";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import { Button, EmptyState, MetricCard, PageHeader, SearchBox, Skeleton } from "@/components/dashboard/ui";
import { useWorkflowRuns } from "@/hooks/use-workflow-runs";
import { useWorkflows } from "@/hooks/use-workflows";
import { formatDuration, toWorkflowRunRow } from "@/lib/workflow-view-model";
import { WorkflowRunTable } from "./workflow-run-table";

export function WorkflowsPage() {
  const [search, setSearch] = useState("");
  const summary = useWorkflows();
  const runs = useWorkflowRuns();
  const runSummary = summary.data?.summary.runs ?? {};
  const definitionSummary = summary.data?.summary.definitions ?? {};
  const rows = useMemo(() => runs.items.map(toWorkflowRunRow), [runs.items]);
  const query = search.trim().toLowerCase();
  const filtered = query ? rows.filter((row) => [row.title, row.repository, row.trigger, row.currentStage, row.status].some((value) => value.toLowerCase().includes(query))) : rows;

  function refresh() {
    summary.refresh();
    runs.refresh();
  }

  return <>
    <PageHeader title="Workflows" subtitle="Monitor documentation workflow runs." actions={<Link href="/workflows/new"><Button primary><Plus className="h-4 w-4" />New workflow</Button></Link>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Active workflows" value={definitionSummary.active ?? "—"} sub="Current organization" icon={<Play className="h-5 w-5" />} />
      <MetricCard label="Total runs" value={runSummary.total ?? "—"} sub={`Last ${runSummary.days ?? 30} days`} icon={<WorkflowIcon className="h-5 w-5" />} />
      <MetricCard label="Success rate" value={runSummary.success_rate === undefined ? "—" : `${runSummary.success_rate}%`} sub="Completed runs" tone="green" icon={<FileCheck2 className="h-5 w-5" />} />
      <MetricCard label="Avg. run time" value={formatDuration(Number(runSummary.avg_duration_seconds ?? NaN))} sub="Completed runs" tone="amber" icon={<WorkflowIcon className="h-5 w-5" />} />
    </div>
    <div className="mt-4"><SectionTabs section="workflows" /></div>
    <div className="mt-4 flex min-w-0 flex-wrap gap-2"><SearchBox className="min-w-[220px] flex-1" placeholder="Search runs..." value={search} onChange={setSearch} /><Button onClick={refresh} disabled={runs.isRefreshing || summary.isRefreshing}>Refresh</Button></div>
    {(runs.error || summary.error || runs.pageError) && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">Unable to load workflows: {runs.error || summary.error || runs.pageError}</div>}
    {runs.isLoading && !runs.data ? <div className="mt-4 space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div> : filtered.length === 0 ? <div className="mt-4"><EmptyState icon={<WorkflowIcon className="h-7 w-7" />} title={search ? "No matching runs" : "No workflow runs yet"} description={search ? "Try a different search term." : "Run a workflow to see its progress here."} /></div> : <div className="mt-4"><WorkflowRunTable rows={filtered} /></div>}
    {runs.hasMore && <div className="mt-4 flex justify-center"><Button onClick={runs.loadMore} disabled={runs.loadingMore || runs.isRefreshing}>{runs.loadingMore ? "Loading..." : "Load more"}</Button></div>}
  </>;
}
