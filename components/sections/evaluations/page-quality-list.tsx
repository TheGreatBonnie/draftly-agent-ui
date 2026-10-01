"use client";

import Link from "next/link";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import { Badge, Card, PageHeader, SectionTitle } from "@/components/dashboard/ui";
import { useQualityPages } from "@/hooks/use-page-quality";
import { pageStatusTone } from "@/lib/page-evaluations";
import { pageRows } from "@/lib/page-quality-view";

export function PageQualityList({ limit = 50 }: { limit?: number }) {
  const pages = useQualityPages(limit);
  const rows = pageRows(pages.data?.items ?? []);

  return (
    <>
      <PageHeader
        title="Pages"
        subtitle="Every evaluated page across all runs, worst score first."
      />
      {pages.error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {pages.error}
        </div>
      )}
      <div className="mt-4">
        <SectionTabs section="evaluations" />
      </div>
      <Card className="mt-4 overflow-hidden">
        <SectionTitle
          title="All pages"
          subtitle={pages.isRefreshing ? "Refreshing…" : `${rows.length} pages shown`}
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
                  {["Page", "Score", "Status", "Run"].map((heading) => (
                    <th className="px-3 py-2" key={heading}>
                      {heading}
                    </th>
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
                      <Badge tone={pageStatusTone(row.statusKey)}>{row.status}</Badge>
                    </td>
                    <td className="px-3 py-3 font-mono text-foreground-muted">
                      {row.runId.slice(0, 8)}
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
