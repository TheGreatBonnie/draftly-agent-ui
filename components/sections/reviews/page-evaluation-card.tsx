"use client";

import { Badge, Card, ScoreRing, SectionTitle } from "@/components/dashboard/ui";
import {
  pageDetailRows,
  pageRingProgress,
  pageScoreLabel,
  pageStatusLabel,
  pageStatusTone,
  selectEvaluatedPage,
  type PageEvaluationSummary,
} from "@/lib/page-evaluations";

/**
 * Evaluation score for one documentation file. The ring follows the file chosen
 * in the "Proposed changes" dropdown (`selectedPath`), so reviewers read the
 * score against the document they are actually looking at.
 *
 * When no file is selected the card falls back to the page that needs the most
 * attention, and when the selected file has no evaluation it says so rather
 * than borrowing another file's score.
 */
export function PageEvaluationCard({
  pages,
  selectedPath,
}: {
  pages: PageEvaluationSummary[];
  selectedPath?: string | null;
}) {
  const page = selectEvaluatedPage(pages, selectedPath ?? null);

  if (pages.length === 0) {
    return (
      <Card>
        <SectionTitle title="Evaluation" />
        <p className="px-4 pb-4 pt-1 text-sm text-foreground-muted">
          No page evaluations recorded for this review.
        </p>
      </Card>
    );
  }

  if (!page) {
    return (
      <Card>
        <SectionTitle
          title="Evaluation"
          action={
            <Badge tone="slate">
              {pages.length} page{pages.length === 1 ? "" : "s"}
            </Badge>
          }
        />
        <p className="px-4 pb-4 pt-1 text-sm text-foreground-muted">
          No evaluation recorded for{" "}
          <span className="font-mono text-xs">
            {selectedPath ?? "the selected file"}
          </span>
          .
        </p>
      </Card>
    );
  }

  const tone = pageStatusTone(page.status);
  const scoreLabel = pageScoreLabel(page.score);

  return (
    <Card>
      <SectionTitle
        title="Evaluation"
        subtitle="Quality score for the selected file."
        action={
          <Badge tone={tone}>
            {pages.length} page{pages.length === 1 ? "" : "s"}
          </Badge>
        }
      />
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <ScoreRing
          progress={pageRingProgress(page)}
          tone={tone}
          size="h-32 w-32"
          ariaLabel={`${page.path} score: ${scoreLabel}`}
        >
          <div className="text-center">
            <strong className="text-2xl tabular-nums">{scoreLabel}</strong>
            <div className="text-[10px] text-foreground-muted">Page score</div>
            <div className="mt-1 text-[10px] font-medium text-foreground-secondary">
              {pageStatusLabel(page.status)}
            </div>
          </div>
        </ScoreRing>
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-xs text-foreground">
            {page.path}
          </div>
          <dl className="mt-2 grid gap-x-4 gap-y-2 rounded-xl border border-border bg-surface-subtle/40 p-3 text-xs sm:grid-cols-2">
            {pageDetailRows(page).map((row) => (
              <div
                className="flex min-w-0 items-baseline justify-between gap-3"
                key={row.label}
              >
                <dt className="shrink-0 text-foreground-muted">{row.label}</dt>
                <dd
                  className="min-w-0 truncate text-right font-medium"
                  title={row.value}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Card>
  );
}
