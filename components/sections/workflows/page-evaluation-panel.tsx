"use client";

import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";
import { Badge, Card, SectionTitle } from "@/components/dashboard/ui";
import { pageDetailRows, pageStatusLabel, pageStatusTone, type PageEvaluationSummary } from "@/lib/page-evaluations";

export function PageEvaluationPanel({ pages }: { pages: PageEvaluationSummary[] }) {
  return (
    <Card>
      <SectionTitle
        icon={<FileText className="h-4 w-4" />}
        title="Page evaluations"
        subtitle="Per-page generation state and revision attempts."
        action={<Badge tone={pages.length ? "blue" : "slate"}>{pages.length} page{pages.length === 1 ? "" : "s"}</Badge>}
      />
      <div className="divide-y divide-border px-4 pb-4 pt-2">
        {pages.length === 0
          ? <p className="py-3 text-sm text-foreground-muted">No page evaluations recorded.</p>
          : pages.map((page) => <PageEvaluationRow key={page.pageId} page={page} />)}
      </div>
    </Card>
  );
}

function PageEvaluationRow({ page }: { page: PageEvaluationSummary }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = `page-evaluation-${page.pageId}`;
  return (
    <div className="py-3 first:pt-2 last:pb-1">
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