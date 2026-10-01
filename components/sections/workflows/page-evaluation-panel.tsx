"use client";

import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";
import { Badge, Card, ScoreRing, SectionTitle } from "@/components/dashboard/ui";
import {
  findPageEvaluation,
  pageDetailRows,
  pageRingProgress,
  pageScoreLabel,
  pageStatusLabel,
  pageStatusTone,
  selectEvaluatedPage,
  type PageEvaluationSummary,
} from "@/lib/page-evaluations";

export function PageEvaluationPanel({
  pages,
  selectedPath,
}: {
  pages: PageEvaluationSummary[];
  selectedPath?: string | null;
}) {
  return (
    <Card>
      <SectionTitle
        icon={<FileText className="h-4 w-4" />}
        title="Page evaluations"
        subtitle={
          selectedPath
            ? "Quality score for the selected file, with every page below."
            : "Per-page generation state and revision attempts."
        }
        action={<Badge tone={pages.length ? "blue" : "slate"}>{pages.length} page{pages.length === 1 ? "" : "s"}</Badge>}
      />
      {selectedPath !== undefined && (
        <SelectedPageScore pages={pages} selectedPath={selectedPath} />
      )}
      <div className="divide-y divide-border px-4 pb-4 pt-2">
        {pages.length === 0
          ? <p className="py-3 text-sm text-foreground-muted">No page evaluations recorded.</p>
          : pages.map((page) => (
            <PageEvaluationRow
              key={page.pageId}
              page={page}
              selected={selectedPath != null && findPageEvaluation([page], selectedPath) !== null}
            />
          ))}
      </div>
    </Card>
  );
}

/**
 * Ring for the file the reviewer is actually looking at. Never borrows another
 * file's score: an unevaluated selection says so explicitly.
 */
function SelectedPageScore({
  pages,
  selectedPath,
}: {
  pages: PageEvaluationSummary[];
  selectedPath: string | null;
}) {
  const page = selectEvaluatedPage(pages, selectedPath);
  if (pages.length === 0) return null;
  if (!page) {
    return (
      <p className="px-4 pb-2 pt-1 text-sm text-foreground-muted">
        No evaluation recorded for{" "}
        <span className="font-mono text-xs">{selectedPath ?? "the selected file"}</span>.
      </p>
    );
  }
  const tone = pageStatusTone(page.status);
  const scoreLabel = pageScoreLabel(page.score);
  return (
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
  );
}

function PageEvaluationRow({ page, selected = false }: { page: PageEvaluationSummary; selected?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = `page-evaluation-${page.pageId}`;
  return (
    <div className={`py-3 first:pt-2 last:pb-1 ${selected ? "rounded-lg bg-surface-subtle px-2" : ""}`}>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={detailsId}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-1 text-left transition-colors hover:bg-surface-subtle"
      >
        <span className="min-w-0">
          <span className="block truncate font-mono text-sm">{page.path}</span>
          <span className="block text-xs text-foreground-muted">Version {page.version} · {page.attempts} attempt{page.attempts === 1 ? "" : "s"}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <Badge tone={pageStatusTone(page.status)}>{pageStatusLabel(page.status)}</Badge>
          <ChevronDown className={`h-4 w-4 text-foreground-muted transition-transform ${expanded ? "rotate-180" : ""}`} />
        </span>
      </button>
      {expanded && (
        <dl id={detailsId} className="mt-2 grid gap-x-4 gap-y-2 rounded-xl border border-border bg-surface-subtle/40 p-3 text-xs sm:grid-cols-2">
          {pageDetailRows(page).map((row) => (
            <div className="flex min-w-0 items-baseline justify-between gap-3" key={row.label}>
              <dt className="shrink-0 text-foreground-muted">{row.label}</dt>
              <dd className="min-w-0 truncate text-right font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
