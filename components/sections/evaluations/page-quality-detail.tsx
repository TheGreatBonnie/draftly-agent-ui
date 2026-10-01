"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getReviewByRunId } from "@/api/observability";
import { Badge, Card, PageHeader, SectionTitle } from "@/components/dashboard/ui";
import { ScoreRing } from "@/components/primitives/score-ring";
import {
  findPageEvaluation,
  pageDetailRows,
  pageRingProgress,
  pageScoreLabel,
  pageStatusLabel,
  pageStatusTone,
} from "@/lib/page-evaluations";
import { normalizePageResults } from "@/lib/page-evaluations";

interface DetailState {
  status: "loading" | "ready" | "missing-review" | "missing-page" | "error";
  message?: string;
  pagePath?: string;
  score?: number | null;
  statusKey?: string;
  runId?: string;
  reviewId?: string;
  rows?: ReturnType<typeof pageDetailRows>;
}

export function PageQualityDetail({ pageId, runId }: { pageId: string; runId?: string }) {
  const [state, setState] = useState<DetailState>({ status: "loading" });

  useEffect(() => {
    if (!runId) {
      setState({ status: "missing-review" });
      return;
    }
    let cancelled = false;
    getReviewByRunId(runId)
      .then(({ review }) => {
        if (cancelled) return;
        const pages = normalizePageResults(review.display?.page_results);
        const page = findPageEvaluation(pages, pageId);
        if (!page) {
          setState({ status: "missing-page", pagePath: pageId, runId });
          return;
        }
        setState({
          status: "ready",
          pagePath: page.path,
          score: page.score,
          statusKey: page.status,
          runId,
          reviewId: review.id,
          rows: pageDetailRows(page),
        });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Failed to load the review.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [pageId, runId]);

  return (
    <>
      <PageHeader
        title={state.pagePath ?? pageId}
        subtitle={state.runId ? `Evaluated in run ${state.runId.slice(0, 8)}` : "Page evaluation"}
      />
      {state.status === "loading" && (
        <div role="status" className="p-5 text-sm text-foreground-muted">
          Loading page evaluation…
        </div>
      )}
      {state.status === "missing-review" && (
        <Card className="p-5 text-sm text-foreground-muted">
          This page arrived without a run reference, so its evaluation cannot be
          located. Open it from the{" "}
          <Link className="text-blue-600" href="/evaluations/pages">
            pages list
          </Link>
          .
        </Card>
      )}
      {state.status === "missing-page" && (
        <Card className="p-5 text-sm text-foreground-muted">
          No evaluation was recorded for this page in run {state.runId?.slice(0, 8)}. The
          page may not have been part of that run.
        </Card>
      )}
      {state.status === "error" && (
        <div role="alert" className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {state.message}
        </div>
      )}
      {state.status === "ready" && (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="p-5">
            <SectionTitle title="Score" subtitle={pageStatusLabel(state.statusKey ?? "")} />
            <div className="mt-3 flex items-center gap-4">
              <ScoreRing progress={pageRingProgress({ score: state.score ?? null })} />
              <div>
                <div className="text-2xl font-semibold">{pageScoreLabel(state.score ?? null)}</div>
                <Badge tone={pageStatusTone(state.statusKey ?? "")}>{state.status}</Badge>
              </div>
            </div>
            {state.reviewId && (
              <div className="mt-4 text-sm">
                <Link className="text-blue-600" href={`/reviews/${state.reviewId}`}>
                  Open the review
                </Link>
              </div>
            )}
          </Card>
          <Card className="p-5 xl:col-span-2">
            <SectionTitle title="Metrics" subtitle="What the page was scored on" />
            <div className="mt-3 divide-y divide-border">
              {(state.rows ?? []).length === 0 ? (
                <p className="py-3 text-sm text-foreground-muted">No metric detail recorded.</p>
              ) : (
                (state.rows ?? []).map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-3 py-2 text-sm">
                    <div className="font-medium">{row.label}</div>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
