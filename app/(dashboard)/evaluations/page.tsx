"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  FileCheck2,
  Plus,
  XCircle,
} from "lucide-react";
import { startEvaluation } from "@/api/evaluations";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import {
  Badge,
  Button,
  Card,
  MetricCard,
  PageHeader,
  Progress,
  SectionTitle,
} from "@/components/dashboard/ui";
import { EvaluationScoreTrend } from "@/components/sections/evaluations/evaluation-score-trend";
import { useEvaluations } from "@/hooks/use-evaluations";
import {
  evaluationScore,
  evaluationStatusLabel,
  evaluationTone,
  formatEvaluationDate,
} from "@/lib/evaluations";

function ScoresByMetric({
  metrics,
}: {
  metrics: Array<{ metric: string; average_score: number; sample_count: number }>;
}) {
  return (
    <Card className="min-w-0">
      <SectionTitle title="Scores by metric" subtitle="Persisted evaluator averages" />
      <div className="space-y-5 px-4 pb-5 pt-4">
        {metrics.length === 0 ? (
          <p className="text-sm text-foreground-muted">No metric results yet.</p>
        ) : metrics.slice(0, 6).map((metric) => (
          <div
            key={metric.metric}
            className="grid grid-cols-[minmax(0,1fr)_42px] gap-3 text-xs"
          >
            <div>
              <div className="mb-1 flex justify-between gap-2">
                <span className="truncate">{metric.metric}</span>
                <span className="text-foreground-muted">{metric.sample_count} samples</span>
              </div>
              <Progress value={metric.average_score} />
            </div>
            <span className="font-semibold">{evaluationScore(metric.average_score)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Page() {
  const [days, setDays] = useState<1 | 7 | 14 | 30>(14);
  const [starting, setStarting] = useState(false);
  const { runs, summary, catalog } = useEvaluations(days);
  const aggregate = summary.data;
  const runItems = runs.data?.items ?? [];

  const runEvaluation = async () => {
    setStarting(true);
    try {
      await startEvaluation({ live: false }, crypto.randomUUID());
      runs.refresh();
    } finally {
      setStarting(false);
    }
  };
  const failed = aggregate?.failed_runs ?? 0;
  const passed = aggregate?.passed_runs ?? 0;

  return (
    <>
      <PageHeader
        title="Evaluations"
        subtitle="Inspect quality from persisted evaluation runs and case-level evidence."
        actions={(
          <Button primary onClick={runEvaluation} disabled={starting}>
            <Plus className="h-4 w-4" />
            {starting ? "Queueing…" : "Run evaluation"}
          </Button>
        )}
      />
      {(runs.error || summary.error || catalog.error) && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {runs.error || summary.error || catalog.error}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Average score"
          value={evaluationScore(aggregate?.average_score ?? null)}
          sub={`Last ${days} days`}
          tone="green"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <MetricCard
          label="Total runs"
          value={String(aggregate?.total_runs ?? 0)}
          sub={`Last ${days} days`}
          icon={<Boxes className="h-5 w-5" />}
        />
        <MetricCard
          label="Passed"
          value={String(passed)}
          sub={aggregate?.pass_rate == null
            ? "Pass rate unavailable"
            : `${Math.round(aggregate.pass_rate * 100)}% pass rate`}
          tone="green"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricCard
          label="Failed"
          value={String(failed)}
          sub="Completed runs"
          tone="rose"
          icon={<XCircle className="h-5 w-5" />}
        />
        <MetricCard
          label="Test cases"
          value={String(aggregate?.total_cases ?? 0)}
          sub={`${catalog.data?.datasets.length ?? 0} datasets`}
          tone="violet"
          icon={<FileCheck2 className="h-5 w-5" />}
        />
      </div>
      <div className="mt-4">
        <SectionTabs section="evaluations" />
      </div>
      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-3">
        <EvaluationScoreTrend
          trend={aggregate?.trend ?? []}
          days={days}
          onDaysChange={setDays}
        />
        <ScoresByMetric metrics={aggregate?.by_metric ?? []} />
      </div>
      <Card className="mt-4 overflow-hidden">
        <SectionTitle
          title="Recent evaluation runs"
          subtitle={runs.isRefreshing
            ? "Refreshing…"
            : `${runs.data?.total ?? runItems.length} persisted runs`}
        />
        {runs.isLoading ? (
          <div role="status" className="p-5 text-sm text-foreground-muted">
            Loading evaluation runs…
          </div>
        ) : runItems.length === 0 ? (
          <div role="status" className="p-5 text-sm text-foreground-muted">
            No evaluation runs have been recorded.
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="min-w-full text-left text-xs">
              <thead className="text-foreground-muted">
                <tr>
                  {["Run ID", "Name", "Datasets", "Cases", "Passed", "Failed", "Score", "Status"].map((heading) => (
                    <th className="px-3 py-2" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {runItems.map((run) => (
                  <tr key={run.run_id}>
                    <td className="px-3 py-3 text-blue-600">
                      <Link href={`/evaluations/runs/${encodeURIComponent(run.run_id)}`}>
                        {run.run_id}
                      </Link>
                    </td>
                    <td className="px-3 py-3 font-medium">{run.name}</td>
                    <td className="px-3 py-3">{run.datasets.join(", ") || run.evaluation_type}</td>
                    <td className="px-3 py-3">{run.cases}</td>
                    <td className="px-3 py-3 text-emerald-600">{run.passed}</td>
                    <td className="px-3 py-3 text-rose-600">{run.failed}</td>
                    <td className="px-3 py-3">{evaluationScore(run.score)}</td>
                    <td className="px-3 py-3">
                      <Badge tone={evaluationTone(run.status)}>
                        {evaluationStatusLabel(run.status)}
                      </Badge>
                      <div className="mt-1 text-[10px] text-foreground-muted">
                        {formatEvaluationDate(run.started_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
