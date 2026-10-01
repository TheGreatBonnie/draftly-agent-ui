"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import {
  Badge,
  Card,
  MetricCard,
  PageHeader,
  Progress,
  SectionTitle,
} from "@/components/dashboard/ui";
import { EvaluationScoreTrend } from "@/components/sections/evaluations/evaluation-score-trend";
import { usePageQuality, useQualityPages } from "@/hooks/use-page-quality";
import { pageStatusLabel, pageStatusTone } from "@/lib/page-evaluations";
import {
  metricRows,
  pageQualityCards,
  pageRows,
  type QualityCard,
} from "@/lib/page-quality-view";

const CARD_ICONS: Record<string, React.ReactNode> = {
  "Average score": <BarChart3 className="h-5 w-5" />,
  "Pages scored": <FileCheck2 className="h-5 w-5" />,
  Runs: <Boxes className="h-5 w-5" />,
  Passed: <CheckCircle2 className="h-5 w-5" />,
  "Needs work": <AlertTriangle className="h-5 w-5" />,
};

function QualityCards({ cards }: { cards: QualityCard[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          label={card.label}
          value={card.value}
          sub={card.sub}
          tone={card.tone}
          icon={CARD_ICONS[card.label]}
        />
      ))}
    </div>
  );
}

export default function Page() {
  const [days, setDays] = useState<1 | 7 | 14 | 30>(14);
  const { summary } = usePageQuality(days);
  const pages = useQualityPages(20);
  const aggregate = summary.data;
  const rows = pageRows(pages.data?.items ?? []);

  return (
    <>
      <PageHeader
        title="Page quality"
        subtitle="Per-page documentation scores from the latest evaluation of each page."
      />
      {(summary.error || pages.error) && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {summary.error || pages.error}
        </div>
      )}
      {aggregate && <QualityCards cards={pageQualityCards(aggregate)} />}
      <div className="mt-4">
        <SectionTabs section="evaluations" />
      </div>
      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-3">
        <EvaluationScoreTrend
          trend={aggregate?.trend ?? []}
          days={days}
          onDaysChange={setDays}
        />
        <Card className="min-w-0">
          <SectionTitle title="Scores by metric" subtitle="Averages over the latest page scores" />
          <div className="space-y-5 px-4 pb-5 pt-4">
            {(aggregate ? metricRows(aggregate) : []).length === 0 ? (
              <p className="text-sm text-foreground-muted">No metric results yet.</p>
            ) : (
              metricRows(aggregate!).slice(0, 6).map((metric) => (
                <div
                  key={metric.label}
                  className="grid grid-cols-[minmax(0,1fr)_42px] gap-3 text-xs"
                >
                  <div>
                    <div className="mb-1 flex justify-between gap-2">
                      <span className="truncate">{metric.label}</span>
                    </div>
                    <Progress value={metric.ratio * 100} />
                  </div>
                  <span className="font-semibold">{metric.value}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
      <Card className="mt-4 overflow-hidden">
        <SectionTitle
          title="Needs work"
          subtitle={pages.isRefreshing
            ? "Refreshing…"
            : "Lowest-scored pages first"}
        />
        {pages.isLoading ? (
          <div role="status" className="p-5 text-sm text-foreground-muted">
            Loading page evaluations…
          </div>
        ) : rows.length === 0 ? (
          <div role="status" className="p-5 text-sm text-foreground-muted">
            No page evaluations have been recorded.
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="min-w-full text-left text-xs">
              <thead className="text-foreground-muted">
                <tr>
                  {["Page", "Score", "Status"].map((heading) => (
                    <th className="px-3 py-2" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={`${row.runId}:${row.pageId}`}>
                    <td className="px-3 py-3 font-medium text-blue-600">
                      <Link
                        href={`/evaluations/pages/${encodeURIComponent(row.pageId)}?runId=${encodeURIComponent(row.runId)}`}
                      >
                        {row.path}
                      </Link>
                    </td>
                    <td className="px-3 py-3">{row.score}</td>
                    <td className="px-3 py-3">
                      <Badge tone={pageStatusTone(row.statusKey)}>
                        {row.status}
                      </Badge>
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
