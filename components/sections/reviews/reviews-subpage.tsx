"use client";

import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { useMemo } from "react";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import { Badge, Card, EmptyState, PageHeader, Progress, Skeleton } from "@/components/dashboard/ui";
import { useReviews } from "@/hooks/use-reviews";
import { toReviewViewModel } from "@/lib/reviews";

const titles: Record<string, string> = {
  pending: "Pending reviews",
  "needs-attention": "Reviews needing attention",
  approved: "Approved reviews",
  rejected: "Rejected reviews",
};

function badgeTone(status: string): "green" | "rose" | "amber" | "blue" {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "rose";
  if (status === "Needs changes") return "amber";
  return "blue";
}

export function ReviewsSubpage({ kind }: { kind: string }) {
  const status = kind === "pending" || kind === "approved" || kind === "rejected" ? kind : undefined;
  const { data, error, isLoading, refresh } = useReviews({ status, limit: 100 });
  const reviews = useMemo(() => (data?.items ?? []).map(toReviewViewModel), [data?.items]);
  const rows = kind === "needs-attention"
    ? reviews.filter((review) => review.rawStatus === "pending" && (review.risk?.toLowerCase() === "high" || review.risk?.toLowerCase() === "critical" || (review.score !== null && review.score < 80)))
    : reviews;

  return <>
    <PageHeader title={titles[kind] ?? "Reviews"} subtitle="Human-in-the-loop documentation review queue backed by your Draftly workspace." />
    <SectionTabs section="reviews" reviewCounts={data?.counts} />
    {isLoading ? <div className="mt-4 space-y-3">{[1, 2, 3].map((item) => <Skeleton className="h-28 w-full" key={item} />)}</div> : error && !data ? <Card className="mt-4 p-8 text-center"><p className="text-sm text-danger">Unable to load reviews: {error}</p><button type="button" className="mt-4 rounded-lg border border-border px-4 py-2 text-sm" onClick={refresh}>Retry</button></Card> : rows.length === 0 ? <div className="mt-4"><EmptyState icon={<FileCheck2 className="h-6 w-6" />} title="No reviews found" description="Reviews matching this queue will appear here when the backend creates them." /></div> : <div className="mt-4 space-y-3">{rows.map((review) => <Card className="p-4" key={review.id}><div className="flex flex-col gap-4 md:flex-row md:items-center"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50"><FileCheck2 className="h-5 w-5" /></div><div className="min-w-0 flex-1"><Link href={`/reviews/${review.id}`} className="font-semibold hover:text-brand">{review.title}</Link><p className="mt-1 text-xs text-foreground-muted">{review.description}</p><div className="mt-2 flex flex-wrap gap-2">{review.repository && <Badge>{review.repository}</Badge>}<Badge tone="slate">{review.type ?? "Unknown type"}</Badge><Badge tone={review.risk?.toLowerCase() === "high" || review.risk?.toLowerCase() === "critical" ? "rose" : review.risk?.toLowerCase() === "medium" ? "amber" : "green"}>{review.risk ?? "Unknown"} risk</Badge></div></div><div className="w-full md:w-40"><div className="mb-1 flex justify-between text-xs"><span>Evaluation</span><b>{review.score === null ? "—" : `${Math.round(review.score)}%`}</b></div><Progress value={review.score ?? 0} /></div><Badge tone={badgeTone(review.status)}>{review.status}</Badge></div></Card>)}</div>}
  </>;
}

export default ReviewsSubpage;
