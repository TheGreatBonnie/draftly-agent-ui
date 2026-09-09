"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/ui";
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

export default function OverviewPage() {
  const { user, isLoaded } = useUser();
  const [range, setRange] = useState<ChartRange>("Last 14 days");
  const [dateRange, setDateRange] = useState("Aug 18, 2026 – Sep 5, 2026");
  const name = isLoaded ? user?.firstName || "there" : "there";

  return <><PageHeader title={`${getGreeting()}, ${name} 👋`} subtitle="Your documentation is in good shape. Here’s the work that needs your attention first." actions={<div className="flex w-full flex-wrap gap-2 sm:w-auto"><RangeMenu calendar label="Choose dashboard date range" value={dateRange} options={["Aug 18, 2026 – Sep 5, 2026", "Aug 25, 2026 – Sep 5, 2026", "Sep 1, 2026 – Sep 5, 2026"]} onChange={setDateRange} /><Link href="/workflows/new" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-transparent bg-brand px-4 text-sm font-medium text-brand-foreground hover:brightness-110 sm:flex-none"><Plus className="h-4 w-4" />New workflow</Link></div>} /><div className="space-y-4"><AttentionPanel /><WorkspaceSummary /><div className="grid gap-4 xl:grid-cols-[1.55fr_.95fr]"><div className="space-y-4"><ActivityChart range={range} onRangeChange={setRange} /><SystemPulse /><RecentChanges /></div><div className="space-y-4"><EvaluationResults /><ActiveWorkflows /><IntegrationPromo /></div></div></div></>;
}
