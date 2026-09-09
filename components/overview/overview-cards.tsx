import Link from "next/link";
import { Activity, Bot, Database, FileCheck2, FileText, GitPullRequest, SearchCheck, ServerCog, Sparkles, Star, Workflow } from "lucide-react";
import type { OverviewSnapshot } from "@/api/overview";
import { Badge, Card, IconTile, MetricCard, Progress, SectionTitle, TinyLink } from "@/components/dashboard/ui";
import { formatRelativeTime, formatScore, formatTrend, scoreToProgress, statusTone } from "@/lib/overview";

const systemIcons = [Bot, Database, SearchCheck, ServerCog];

export function SystemPulse({ system, integrationIssues }: { system: OverviewSnapshot["system"]; integrationIssues: number }) {
  const items = [
    { label: "Agents", value: `${system.agents_online}/${system.agents_total} online` },
    { label: "Data sources", value: `${system.data_sources_connected}/${system.data_sources_total} connected` },
    { label: "Evaluations", value: system.evaluations_status },
    { label: "Scheduler", value: system.scheduler_status },
  ];
  const hasIssues = integrationIssues > 0 || system.evaluations_status === "Failed" || system.scheduler_status === "Unavailable";
  return <Card><SectionTitle icon={<Activity className="h-4 w-4" />} title="System pulse" action={<Badge tone={hasIssues ? "rose" : "green"}>● {hasIssues ? "Needs attention" : "All systems operational"}</Badge>} /><div className="grid gap-2 p-4 sm:grid-cols-2 md:grid-cols-4">{items.map(({ label, value }, index) => { const Icon = systemIcons[index]; const tone = statusTone(value); return <div key={label} className="rounded-xl border border-border p-3"><Icon aria-hidden="true" className="h-4 w-4 text-brand" /><div className="mt-2 text-sm font-medium">{label}</div><div className={`mt-1 text-xs ${tone === "rose" ? "text-danger" : tone === "amber" ? "text-warning" : "text-success"}`}>● {value}</div></div>; })}</div></Card>;
}

export function RecentChanges({ items }: { items: OverviewSnapshot["recent_changes"] }) {
  return <Card><SectionTitle icon={<Sparkles className="h-4 w-4" />} title="Recent documentation changes" action={<TinyLink href="/documentation/recently-updated">View all</TinyLink>} /><div className="divide-y divide-border px-4 pb-2">{items.length === 0 ? <p className="py-6 text-center text-sm text-foreground-muted">No documentation changes yet.</p> : items.map((item) => { const tone = statusTone(item.status); return <Link href={item.href} key={item.id} className="flex items-center gap-3 py-3"><IconTile size="sm" tone={tone}><FileText aria-hidden="true" className="h-4 w-4" /></IconTile><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{item.title}</div><div className="truncate text-xs text-foreground-muted">{item.detail}</div></div><span className="hidden text-xs text-foreground-muted md:block">{formatRelativeTime(item.timestamp)}</span><Badge tone={tone}>{item.status}</Badge></Link>; })}</div></Card>;
}

export function EvaluationResults({ evaluation }: { evaluation: OverviewSnapshot["evaluation"] }) {
  const trend = formatTrend(evaluation.trend);
  const tones = ["green", "blue", "violet", "amber", "green"] as const;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = scoreToProgress(evaluation.average_score);
  const scoreLabel = formatScore(evaluation.average_score);

  return <Card>
    <SectionTitle icon={<FileCheck2 className="h-4 w-4" />} title="Evaluation results" subtitle="Quality signals from recent runs" action={<TinyLink href="/evaluations">View all</TinyLink>} />
    <div className="grid gap-5 p-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center">
      <div role="img" aria-label={`Average evaluation score: ${scoreLabel}`} className="relative mx-auto h-28 w-28 shrink-0">
        <svg aria-hidden="true" className="h-full w-full -rotate-90" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-subtle" />
          <circle cx="56" cy="56" r={radius} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-success transition-[stroke-dashoffset] duration-500" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} />
        </svg>
        <div className="absolute inset-0 grid place-items-center px-2 text-center">
          <div className="flex min-w-0 flex-col items-center gap-1">
            <strong className="whitespace-nowrap text-xl leading-none tabular-nums">{scoreLabel}</strong>
            <span className="text-[9px] leading-3 text-foreground-muted">Average score</span>
            {trend && <Badge className="px-1.5 py-0.5 text-[10px] leading-3" tone={evaluation.trend !== null && evaluation.trend >= 0 ? "green" : "rose"}>{trend}</Badge>}
          </div>
        </div>
      </div>
      <div className="grid min-w-0 gap-3">
        {evaluation.dimensions.length === 0 ? <p className="text-sm text-foreground-muted">No evaluation dimensions recorded yet.</p> : evaluation.dimensions.map(({ name, value }, index) => <div key={name}>
          <div className="mb-1 flex items-center justify-between gap-3 text-xs leading-5">
            <span className="min-w-0 truncate">{name}</span>
            <span className="shrink-0 whitespace-nowrap font-medium tabular-nums">{formatScore(value)}</span>
          </div>
          <Progress value={value} tone={tones[index % tones.length]} />
        </div>)}
      </div>
    </div>
  </Card>;
}

export function ActiveWorkflows({ workflows }: { workflows: OverviewSnapshot["active_workflows"] }) {
  return <Card><SectionTitle icon={<Workflow className="h-4 w-4" />} title="Active workflows" action={<TinyLink href="/workflows/active">View all</TinyLink>} /><div className="divide-y divide-border p-4">{workflows.length === 0 ? <p className="py-6 text-center text-sm text-foreground-muted">No active workflows.</p> : workflows.map((workflow) => { const tone = statusTone(workflow.status); return <Link href={workflow.href} key={workflow.id} className="flex gap-3 py-3 first:pt-0 last:pb-0"><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{workflow.name}</div><div className="mt-1 truncate text-xs text-foreground-muted">{workflow.repository}</div></div><div className="text-right text-xs"><div className={tone === "green" ? "text-success" : tone === "rose" ? "text-danger" : "text-foreground-muted"}>● {workflow.status}</div><div className="mt-1 text-foreground-muted">{formatRelativeTime(workflow.timestamp)}</div></div></Link>; })}</div></Card>;
}

function IntegrationCardIllustration() { return <svg aria-hidden="true" viewBox="0 0 132 188" className="pointer-events-none absolute inset-y-0 right-0 h-full w-[205px]" fill="none"><rect x="56" y="95" width="69" height="98" rx="8" fill="#9A8AF7" fillOpacity=".55" /><rect x="66" y="106" width="49" height="9" rx="4.5" fill="#8172F5" fillOpacity=".32" /><path d="M43 116a7 7 0 0 1 7-7h48a7 7 0 0 1 7 7v79H43v-79Z" fill="#D7D1FF" stroke="#9A8AF7" strokeWidth="1.25" /><path d="M29 127a7 7 0 0 1 7-7h49a7 7 0 0 1 7 7v68H29v-68Z" fill="white" stroke="#7764F2" strokeWidth="1.5" /><rect x="39" y="137" width="34" height="5" rx="2.5" fill="#6653EE" /><rect x="39" y="150" width="43" height="5" rx="2.5" fill="#8A79F7" /><rect x="39" y="163" width="29" height="5" rx="2.5" fill="#A69AF9" /></svg>; }

export function IntegrationPromo() { return <aside aria-labelledby="integration-promo-title" className="relative h-[292px] overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-violet-50/90 to-blue-50 p-7 dark:border-violet-900/50 dark:from-violet-950/40 dark:via-violet-950/35 dark:to-blue-950/40"><div className="relative z-10 max-w-[270px]"><h3 id="integration-promo-title" className="text-lg font-semibold leading-6 text-foreground">Turn conversations<br />into better documentation</h3><p className="mt-3 text-sm leading-5 text-foreground-muted">Connect more data sources to help<br />Draftly stay up to date.</p></div><Link href="/integrations/add" className="absolute bottom-7 left-7 z-10 inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-5 text-[13px] font-medium text-brand transition-colors hover:bg-surface-subtle"><GitPullRequest className="h-[18px] w-[18px]" />Add integration</Link><IntegrationCardIllustration /></aside>; }

export function WorkspaceSummary({ summary, evaluation }: { summary: OverviewSnapshot["summary"]; evaluation: OverviewSnapshot["evaluation"] }) {
  const evaluationTrend = formatTrend(evaluation.trend);
  return <section aria-label="Workspace summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Documentation" value={summary.documentation_total} sub="Total documents" icon={<FileText />} /><MetricCard label="Active workflows" value={summary.active_workflows} sub={`${summary.running_workflows} running • ${summary.scheduled_workflows} scheduled`} tone="violet" icon={<Activity />} /><MetricCard label="Review queue" value={summary.pending_reviews} sub="Pending human review" tone="green" icon={<FileCheck2 />} /><MetricCard label="Avg. evaluation score" value={formatScore(summary.average_evaluation_score)} sub="Across all runs" trend={evaluationTrend && evaluation.trend !== null && evaluation.trend >= 0 ? `${evaluation.trend}%` : undefined} tone="amber" icon={<Star />} /></section>;
}
