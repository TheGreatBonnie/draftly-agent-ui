import { pageScoreLabel } from "./page-evaluations.ts";
import type { PageQualityMetric, PageQualitySummary, QualityPageItem } from "../api/page-quality.ts";

export interface QualityCard {
  label: string;
  value: string;
  sub: string;
  tone?: "green" | "rose" | "violet" | "amber";
}

export function pageQualityCards(summary: PageQualitySummary): QualityCard[] {
  return [
    {
      label: "Average score",
      value: pageScoreLabel(summary.average_score),
      sub: "Latest page scores",
      tone: "green",
    },
    {
      label: "Pages scored",
      value: `${summary.scored_pages} of ${summary.total_pages}`,
      sub: "Pages with a final score",
    },
    {
      label: "Runs",
      value: String(summary.total_runs),
      sub: "Documentation runs evaluated",
    },
    {
      label: "Passed",
      value: String(summary.passed),
      sub: "Pages accepted",
      tone: "green",
    },
    {
      label: "Needs work",
      value: String(summary.needs_revision + summary.awaiting_human),
      sub: "Revision or human review",
      tone: "rose",
    },
  ];
}

export interface MetricRow {
  label: string;
  value: string;
  ratio: number;
}

export function metricRows(summary: PageQualitySummary): MetricRow[] {
  return summary.by_metric.map((m: PageQualityMetric) => ({
    label: m.metric,
    value: pageScoreLabel(m.average_score),
    ratio: m.average_score == null ? 0 : Math.max(0, Math.min(100, m.average_score)) / 100,
  }));
}

export interface QualityPageRow {
  pageId: string;
  path: string;
  score: string;
  status: string;
  statusKey: string;
  runId: string;
}

const PAGE_STATUS_LABELS: Record<string, string> = {
  passed: "Passed",
  revision_required: "Needs revision",
  awaiting_human_review: "Awaiting review",
};

export function pageRows(items: QualityPageItem[]): QualityPageRow[] {
  return items.map((item) => {
    const key = item.status ?? "";
    return {
      pageId: item.page_id,
      path: item.path ?? item.page_id,
      score: pageScoreLabel(item.score),
      status: PAGE_STATUS_LABELS[key] ?? "Unknown",
      statusKey: key,
      runId: item.run_id,
    };
  });
}
