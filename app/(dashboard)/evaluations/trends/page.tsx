"use client";

import { useState } from "react";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import { PageHeader } from "@/components/dashboard/ui";
import { EvaluationScoreTrend } from "@/components/sections/evaluations/evaluation-score-trend";
import { usePageQuality } from "@/hooks/use-page-quality";

export default function Page() {
  const [days, setDays] = useState<1 | 7 | 14 | 30>(14);
  const { summary } = usePageQuality(days);

  return (
    <>
      <PageHeader
        title="Trends"
        subtitle="Average page score per day across every documentation run."
      />
      {summary.error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {summary.error}
        </div>
      )}
      <div className="mt-4">
        <SectionTabs section="evaluations" />
      </div>
      <div className="mt-4">
        {summary.isLoading ? (
          <div role="status" className="p-5 text-sm text-foreground-muted">
            Loading score trend…
          </div>
        ) : (
          <EvaluationScoreTrend
            trend={summary.data?.trend ?? []}
            days={days}
            onDaysChange={setDays}
          />
        )}
      </div>
    </>
  );
}
