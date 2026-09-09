"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/ui";
import { useOverview } from "@/hooks/use-overview";
import { type ChartRange } from "@/lib/dashboard-state";
import { ActivityChart } from "./activity-chart";
import { AttentionPanel } from "./attention-panel";
import { RangeMenu } from "./range-menu";
import { ActiveWorkflows, EvaluationResults, IntegrationPromo, RecentChanges, SystemPulse, WorkspaceSummary } from "./overview-cards";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

function OverviewSkeleton() {
  return <div aria-busy="true" aria-label="Loading overview" className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-[92px] animate-pulse rounded-2xl border border-border bg-surface-subtle" />)}</div><div className="grid gap-4 xl:grid-cols-[1.55fr_.95fr]"><div className="space-y-4"><div className="h-[356px] animate-pulse rounded-2xl border border-border bg-surface-subtle" /><div className="h-[180px] animate-pulse rounded-2xl border border-border bg-surface-subtle" /></div><div className="space-y-4"><div className="h-[260px] animate-pulse rounded-2xl border border-border bg-surface-subtle" /><div className="h-[220px] animate-pulse rounded-2xl border border-border bg-surface-subtle" /></div></div></div>;
}

function OverviewError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div role="alert" className="rounded-2xl border border-danger/30 bg-danger/5 p-6"><h2 className="font-semibold text-foreground">Couldn’t load your overview</h2><p className="mt-1 text-sm text-foreground-muted">{message}</p><button type="button" onClick={onRetry} className="mt-4 inline-flex h-9 items-center rounded-lg bg-brand px-3 text-sm font-medium text-brand-foreground hover:brightness-110">Try again</button></div>;
}

export default function OverviewPage() {
  const { user, isLoaded } = useUser();
  const [range, setRange] = useState<ChartRange>("Last 14 days");
  const [dateRange, setDateRange] = useState("Aug 18, 2026 – Sep 5, 2026");
  const { data, error, isLoading, isRefreshing, refresh } = useOverview(range);
  const name = isLoaded ? user?.firstName || "there" : "there";

  return <><PageHeader title={`${getGreeting()}, ${name} 👋`} subtitle="Your documentation is in good shape. Here’s the work that needs your attention first." actions={<div className="flex w-full flex-wrap gap-2 sm:w-auto"><RangeMenu calendar label="Choose dashboard date range" value={dateRange} options={["Aug 18, 2026 – Sep 5, 2026", "Aug 25, 2026 – Sep 5, 2026", "Sep 1, 2026 – Sep 5, 2026"]} onChange={setDateRange} /><Link href="/workflows/new" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-transparent bg-brand px-4 text-sm font-medium text-brand-foreground hover:brightness-110 sm:flex-none"><Plus className="h-4 w-4" />New workflow</Link></div>} />{isRefreshing && data && <div role="status" className="mb-3 text-right text-xs text-foreground-muted">Updating overview…</div>}{isLoading && !data ? <OverviewSkeleton /> : error && !data ? <OverviewError message={error} onRetry={refresh} /> : data ? <div className="space-y-4"><AttentionPanel attention={data.attention} /><WorkspaceSummary summary={data.summary} evaluation={data.evaluation} /><div className="grid gap-4 xl:grid-cols-[1.55fr_.95fr]"><div className="space-y-4"><ActivityChart activity={data.activity} range={range} onRangeChange={setRange} /><SystemPulse system={data.system} integrationIssues={data.attention.integration_issues} /><RecentChanges items={data.recent_changes} /></div><div className="space-y-4"><EvaluationResults evaluation={data.evaluation} /><ActiveWorkflows workflows={data.active_workflows} /><IntegrationPromo /></div></div></div> : null}</>;
}
