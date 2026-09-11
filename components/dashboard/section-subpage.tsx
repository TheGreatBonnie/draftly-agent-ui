"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Files,
  FolderGit2,
  GitPullRequest,
  MessageSquare,
  Play,
  Search,
  Sparkles,
  Tags,
  Workflow,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  IconTile,
  PageHeader,
  Progress,
} from "@/components/dashboard/ui";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import { workflows } from "@/lib/mock-data";
import { useEvaluations, useEvaluationRun } from "@/hooks/use-evaluations";
import { evaluationScore, evaluationStatusLabel, evaluationTone } from "@/lib/evaluations";

type Section =
  | "reviews"
  | "evaluations"
  | "documentation"
  | "workflows";

const docRows = [
  [
    "OAuth 2.0 authentication guide",
    "Authly",
    "Guide",
    "Up to date",
    "2 hours ago",
  ],
  ["API reference", "Authly", "Reference", "Up to date", "5 hours ago"],
  ["SDK installation guide", "Authly", "Guide", "Needs update", "1 day ago"],
  ["Rate limits and quotas", "Authly", "Concept", "Up to date", "2 days ago"],
  [
    "Deployment with Kubernetes",
    "Authly",
    "Tutorial",
    "Up to date",
    "3 days ago",
  ],
  ["User management", "Authly", "Guide", "Outdated", "5 days ago"],
];
const legacyRuns: Array<[string, string, string, number, number, number, number]> = [];

export function EvaluationsSubpage({ kind }: { kind: string }) {
  const { runs, summary, catalog } = useEvaluations(14);
  const selectedRun = useEvaluationRun(runs.data?.items[0]?.run_id ?? "");
  return <DynamicEvaluationsSubpage kind={kind} runs={runs.data?.items ?? []} cases={selectedRun.data?.cases ?? []} datasets={catalog.data?.datasets ?? []} evaluators={catalog.data?.evaluators ?? []} trend={summary.data?.trend ?? []} loading={runs.isLoading || catalog.isLoading || summary.isLoading} error={runs.error || catalog.error || summary.error} />;
  const title =
    {
      runs: "Evaluation runs",
      "test-cases": "Test cases",
      datasets: "Datasets",
      evaluators: "Evaluators",
      trends: "Evaluation trends",
    }[kind] ?? "Evaluations";
  const content =
    kind === "runs" ? (
      <div className="space-y-3">
        {legacyRuns.map((r) => (
          <Link href={`/evaluations/runs/${r[0]}`} key={String(r[0])}>
            <Card className="mb-3 p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
                <div>
                  <div className="font-semibold">{r[1]}</div>
                  <div className="text-xs text-foreground-muted">
                    {r[0]} · {r[2]}
                  </div>
                </div>
                <span className="text-sm">{r[3]} cases</span>
                <Badge tone={Number(r[5]) === 0 ? "green" : "amber"}>
                  {r[4]} passed
                </Badge>
                <b>{r[6]}%</b>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    ) : kind === "test-cases" ? (
      <div className="grid gap-3 md:grid-cols-2">
        {[
          "oauth-authentication-add",
          "release-notes-versioning",
          "support-groundedness",
          "api-reference-sync",
          "sdk-example-validity",
          "migration-completeness",
        ].map((x, i) => (
          <Link href={`/evaluations/test-cases/${x}`} key={x}>
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <IconTile tone={i === 2 ? "amber" : "green"}>
                  <CheckCircle2 className="h-5 w-5" />
                </IconTile>
                <Badge tone={i === 2 ? "amber" : "green"}>
                  {i === 2 ? "0.71" : "1.00"}
                </Badge>
              </div>
              <h3 className="mt-4 font-semibold">{x}</h3>
              <p className="mt-1 text-xs text-foreground-muted">
                Documentation quality test case with expected content, tools,
                and authoring actions.
              </p>
            </Card>
          </Link>
        ))}
      </div>
    ) : kind === "datasets" ? (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Documentation", 48, 93],
          ["API Reference", 22, 89],
          ["Tutorials", 18, 91],
          ["Release Notes", 16, 87],
          ["Support Responses", 14, 90],
          ["Knowledge Updates", 10, 94],
        ].map((x) => (
          <Card key={String(x[0])} className="p-4">
            <IconTile>
              <Boxes className="h-5 w-5" />
            </IconTile>
            <h3 className="mt-4 font-semibold">{x[0]}</h3>
            <p className="text-xs text-foreground-muted">{x[1]} test cases</p>
            <div className="mt-4">
              <Progress value={Number(x[2])} />
              <div className="mt-1 text-right text-xs font-semibold">
                {x[2]}%
              </div>
            </div>
          </Card>
        ))}
      </div>
    ) : kind === "evaluators" ? (
      <div className="grid gap-3 md:grid-cols-2">
        {[
          "Correctness evaluator",
          "Completeness evaluator",
          "Grounding evaluator",
          "Consistency evaluator",
          "Documentation quality evaluator",
          "Tool usage evaluator",
        ].map((x, i) => (
          <Card className="p-4" key={x}>
            <div className="flex gap-3">
              <IconTile tone={i % 2 ? "violet" : "blue"}>
                <Sparkles className="h-5 w-5" />
              </IconTile>
              <div>
                <h3 className="font-semibold">{x}</h3>
                <p className="mt-1 text-xs text-foreground-muted">
                  Strands Eval SDK evaluator · active · threshold{" "}
                  {i % 2 ? "0.80" : "0.85"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    ) : (
      <Card className="p-5">
        <h3 className="font-semibold">14-day score trend</h3>
        <div className="mt-6 flex h-52 items-end gap-2">
          {[58, 61, 64, 70, 68, 74, 78, 82, 81, 86, 88, 91, 92, 94].map(
            (v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-brand/20"
                style={{ height: `${v}%` }}>
                <div className="h-2 rounded-t bg-brand" />
              </div>
            ),
          )}
        </div>
      </Card>
    );
  return (
    <>
      <PageHeader
        title={title}
        subtitle="Inspect quality, failures, and evaluation assets from the backend."
      />
      <SectionTabs section="evaluations" />
      <div className="mt-4">{content}</div>
    </>
  );
}

function DynamicEvaluationsSubpage({ kind, runs, cases, datasets, evaluators, trend, loading, error }: { kind: string; runs: Array<{ run_id: string; name: string; evaluation_type: string; cases: number; score: number | null; status: "queued" | "running" | "passed" | "failed" | "cancelled" | "skipped" }>; cases: Array<{ id: string; case_id: string; dataset: string; metric: string; score: number | null; passed: boolean }>; datasets: Array<{ name: string; description: string; surface: string; case_count: number; version: string | null }>; evaluators: Array<{ key: string; display_name: string; description: string; threshold: number | null; version: string | null; enabled: boolean }>; trend: Array<{ date: string; average_score: number }>; loading: boolean; error: string | null }) {
  const title = ({ runs: "Evaluation runs", "test-cases": "Test cases", datasets: "Datasets", evaluators: "Evaluators", trends: "Evaluation trends" } as Record<string, string>)[kind] ?? "Evaluations";
  let content: ReactNode = null;
  if (kind === "runs") content = runs.length === 0 ? <EmptyEvaluation text="No evaluation runs have been recorded." /> : <div className="space-y-3">{runs.map((run) => <Link href={`/evaluations/runs/${encodeURIComponent(run.run_id)}`} key={run.run_id}><Card className="p-4"><div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]"><div><div className="font-semibold">{run.name}</div><div className="text-xs text-foreground-muted">{run.run_id} · {run.evaluation_type}</div></div><span className="text-sm">{run.cases} cases</span><Badge tone={evaluationTone(run.status)}>{evaluationStatusLabel(run.status)}</Badge><b>{evaluationScore(run.score)}</b></div></Card></Link>)}</div>;
  if (kind === "test-cases") content = cases.length === 0 ? <EmptyEvaluation text="No case results are available." /> : <div className="grid gap-3 md:grid-cols-2">{cases.map((item) => <Link href={`/evaluations/test-cases/${encodeURIComponent(item.id)}`} key={item.id}><Card className="p-4"><div className="flex items-start justify-between"><IconTile tone={item.passed ? "green" : "rose"}><CheckCircle2 className="h-5 w-5" /></IconTile><Badge tone={item.passed ? "green" : "rose"}>{evaluationScore(item.score)}</Badge></div><h3 className="mt-4 font-semibold">{item.case_id}</h3><p className="mt-1 text-xs text-foreground-muted">{item.dataset} · {item.metric}</p></Card></Link>)}</div>;
  if (kind === "datasets") content = datasets.length === 0 ? <EmptyEvaluation text="No datasets are available." /> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{datasets.map((dataset) => <Card key={dataset.name} className="p-4"><IconTile><Boxes className="h-5 w-5" /></IconTile><h3 className="mt-4 font-semibold">{dataset.name}</h3><p className="text-xs text-foreground-muted">{dataset.case_count} test cases · {dataset.surface}</p><p className="mt-3 text-xs text-foreground-muted">{dataset.description || "No description recorded."} · v{dataset.version || "—"}</p></Card>)}</div>;
  if (kind === "evaluators") content = evaluators.length === 0 ? <EmptyEvaluation text="No evaluators are available." /> : <div className="grid gap-3 md:grid-cols-2">{evaluators.map((evaluator) => <Card className="p-4" key={evaluator.key}><div className="flex gap-3"><IconTile tone="blue"><Sparkles className="h-5 w-5" /></IconTile><div><h3 className="font-semibold">{evaluator.display_name}</h3><p className="mt-1 text-xs text-foreground-muted">{evaluator.key} · {evaluator.enabled ? "active" : "disabled"} · threshold {evaluationScore(evaluator.threshold)} · v{evaluator.version || "—"}</p><p className="mt-2 text-xs text-foreground-muted">{evaluator.description}</p></div></div></Card>)}</div>;
  if (kind === "trends") content = trend.length === 0 ? <EmptyEvaluation text="No completed runs are available for this trend." /> : <Card className="p-5"><h3 className="font-semibold">Persisted score trend</h3><div className="mt-6 flex h-52 items-end gap-2">{trend.map((point) => <div key={point.date} className="flex-1 rounded-t bg-brand/20" style={{ height: `${point.average_score}%` }} title={`${point.date}: ${evaluationScore(point.average_score)}`}><div className="h-2 rounded-t bg-brand" /></div>)}</div></Card>;
  return <><PageHeader title={title} subtitle="Inspect persisted evaluation data and evaluator assets." /><SectionTabs section="evaluations" /><div className="mt-4">{error ? <div role="alert" className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : loading ? <div role="status" className="p-5 text-sm text-foreground-muted">Loading evaluation data…</div> : content}</div></>;
}

function EmptyEvaluation({ text }: { text: string }) { return <div role="status" className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-foreground-muted">{text}</div>; }

export function DocumentationSubpage({ kind }: { kind: string }) {
  const title =
    {
      "by-repository": "Documentation by repository",
      "by-topic": "Documentation by topic",
      outdated: "Outdated documentation",
      "recently-updated": "Recently updated documentation",
    }[kind] ?? "Documentation";
  if (kind === "by-repository")
    return (
      <>
        <PageHeader
          title={title}
          subtitle="Group project documentation by source repository."
        />
        <SectionTabs section="documentation" />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["authly/docs", 164],
            ["authly/api", 82],
            ["authly/sdk", 48],
            ["authly/examples", 24],
          ].map((x) => (
            <Card key={String(x[0])} className="p-5">
              <IconTile>
                <FolderGit2 className="h-5 w-5" />
              </IconTile>
              <h3 className="mt-4 font-semibold">{x[0]}</h3>
              <p className="text-xs text-foreground-muted">
                {x[1]} documents · synced 12 min ago
              </p>
              <Button className="mt-4">Browse repository</Button>
            </Card>
          ))}
        </div>
      </>
    );
  if (kind === "by-topic")
    return (
      <>
        <PageHeader
          title={title}
          subtitle="Browse documentation through Draftly's topic model."
        />
        <SectionTabs section="documentation" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Authentication", 58],
            ["API Reference", 42],
            ["Deployment", 36],
            ["User Management", 28],
            ["SDKs", 24],
            ["Billing", 20],
            ["Security", 18],
            ["Integrations", 16],
          ].map((x) => (
            <Card key={String(x[0])} className="p-4">
              <IconTile tone="violet">
                <Tags className="h-5 w-5" />
              </IconTile>
              <div className="mt-3 font-semibold">{x[0]}</div>
              <div className="text-xs text-foreground-muted">
                {x[1]} documents
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  const rows =
    kind === "outdated"
      ? docRows.filter((r) => r[3] === "Outdated" || r[3] === "Needs update")
      : docRows;
  return (
    <>
      <PageHeader
        title={title}
        subtitle="Search and manage mock project documentation."
      />
      <SectionTabs section="documentation" />
      <Card className="mt-4 overflow-hidden">
        <div className="divide-y divide-border">
          {rows.map((r, i) => (
            <Link
              href="/documentation/oauth-2-0-integration"
              key={String(r[0])}
              className="flex flex-col gap-3 p-4 hover:bg-surface-subtle sm:flex-row sm:items-center">
              <IconTile
                tone={
                  r[3] === "Outdated"
                    ? "rose"
                    : r[3] === "Needs update"
                      ? "amber"
                      : "blue"
                }>
                <Files className="h-5 w-5" />
              </IconTile>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{r[0]}</div>
                <div className="text-xs text-foreground-muted">
                  {r[1]} · {r[2]}
                </div>
              </div>
              <Badge
                tone={
                  r[3] === "Up to date"
                    ? "green"
                    : r[3] === "Outdated"
                      ? "rose"
                      : "amber"
                }>
                {r[3]}
              </Badge>
              <span className="text-xs text-foreground-muted">{r[4]}</span>
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}

export function WorkflowsSubpage({ kind }: { kind: string }) {
  const title =
    {
      active: "Active workflows",
      paused: "Paused workflows",
      drafts: "Workflow drafts",
      templates: "Workflow templates",
    }[kind] ?? "Workflows";
  if (kind === "templates")
    return (
      <>
        <PageHeader
          title={title}
          subtitle="Start from production-oriented Draftly workflow templates."
        />
        <SectionTabs section="workflows" />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Documentation from PRs",
            "Release notes",
            "Scheduled documentation audit",
            "Support knowledge loop",
            "API reference sync",
            "Legacy docs migration",
          ].map((x, i) => (
            <Card key={x} className="p-5">
              <IconTile tone={i % 2 ? "violet" : "blue"}>
                <Workflow className="h-5 w-5" />
              </IconTile>
              <h3 className="mt-4 font-semibold">{x}</h3>
              <p className="mt-1 text-xs text-foreground-muted">
                Preconfigured trigger, agents, evaluation policy, review gate,
                and delivery action.
              </p>
              <Link href="/workflows/new">
                <Button className="mt-4">Use template</Button>
              </Link>
            </Card>
          ))}
        </div>
      </>
    );
  const rows =
    kind === "paused"
      ? workflows.filter((w: any) => !w[5])
      : kind === "drafts"
        ? workflows.slice(-2)
        : workflows.filter((w: any) => w[5]);
  return (
    <>
      <PageHeader
        title={title}
        subtitle="Manage automated documentation workflows with mock run state."
      />
      <SectionTabs section="workflows" />
      <div className="mt-4 space-y-3">
        {rows.map((w: any, i: number) => (
          <Card key={w[0]} className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <IconTile tone={i % 2 ? "violet" : "blue"}>
                <GitPullRequest className="h-5 w-5" />
              </IconTile>
              <div className="flex-1">
                <Link
                  href={`/workflows/${String(w[0])
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}`}
                  className="font-semibold hover:text-brand">
                  {w[0]}
                </Link>
                <p className="text-xs text-foreground-muted">{w[1]}</p>
              </div>
              <div className="text-xs">
                <span className="text-foreground-muted">Trigger</span>
                <div>{w[2]}</div>
              </div>
              <Badge tone={w[5] ? "green" : "slate"}>
                {w[5] ? "Active" : "Paused"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
