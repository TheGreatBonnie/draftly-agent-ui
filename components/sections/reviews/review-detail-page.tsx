"use client";

import Link from "next/link";
import { ArrowLeft, Clock3, FileCheck2, FileText, Github, MessageSquare, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import ReviewActions from "@/components/features/review-actions";
import ReviewDocument from "@/components/features/review-document";
import { Badge, Button, Card, Progress, SectionTitle, Skeleton, Tabs } from "@/components/dashboard/ui";
import { useReview } from "@/hooks/use-review";
import { toReviewViewModel } from "@/lib/reviews";

function statusTone(status: string): "green" | "rose" | "amber" | "blue" {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "rose";
  if (status === "Needs changes") return "amber";
  return "blue";
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function percentage(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value <= 1 ? value * 100 : value;
}

export function ReviewDetailPage({ id }: { id: string }) {
  const { data, error, isLoading, isRefreshing, refresh } = useReview(id);
  const review = useMemo(() => data?.review ? toReviewViewModel(data.review) : null, [data?.review]);

  if (isLoading && !review) return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-[520px] w-full" /></div>;
  if (!review && error) {
    const notFound = /404|unknown review|not found/i.test(error);
    return <Card className="p-8 text-center"><h1 className="text-xl font-semibold">{notFound ? "Review not found" : "Unable to load review"}</h1><p className="mt-2 text-sm text-foreground-muted">{notFound ? "This review may have been removed or belongs to another organization." : error}</p>{!notFound && <Button className="mt-4" onClick={refresh}><RefreshCw className="h-4 w-4" />Retry</Button>}<div className="mt-4"><Link className="text-sm text-brand hover:underline" href="/reviews">Back to reviews</Link></div></Card>;
  }
  if (!review) return null;

  return <>
    <div className="mb-3 flex items-center gap-2 text-sm text-foreground-muted"><Link className="flex items-center gap-1 hover:text-brand" href="/reviews"><ArrowLeft className="h-4 w-4" />Reviews</Link><span>›</span><span className="truncate">{review.title}</span></div>
    <div className="mb-4 flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-semibold">{review.title}</h1>{review.reference && <Badge tone="violet">{review.reference}</Badge>}<Badge tone={statusTone(review.status)}>{review.status}</Badge></div><p className="mt-1 text-sm text-foreground-muted">{review.description}</p><div className="mt-4 grid gap-3 text-xs sm:grid-cols-2 xl:grid-cols-4"><div className="flex gap-2"><Github className="h-4 w-4 text-foreground-muted" /><span>{review.repository ?? "Unknown repository"}<br /><b className="text-foreground">Repository</b></span></div><div className="flex gap-2"><FileText className="h-4 w-4 text-foreground-muted" /><span>{review.path ?? "No affected file"}<br /><b className="text-foreground">Affected file</b></span></div><div className="flex gap-2"><FileCheck2 className="h-4 w-4 text-foreground-muted" /><span>{review.type ?? "Unknown"}<br /><b className="text-foreground">Change type</b></span></div><div className="flex gap-2"><Clock3 className="h-4 w-4 text-foreground-muted" /><span>{formatDate(review.createdAt)}<br /><b className="text-foreground">Generated {review.updatedAt ? formatDate(review.updatedAt) : "—"}</b></span></div></div></div><div className="flex gap-2">{review.githubUrl ? <a href={review.githubUrl} target="_blank" rel="noreferrer"><Button>View in GitHub</Button></a> : <Button disabled>GitHub unavailable</Button>}<Button ariaLabel="More review actions">•••</Button></div></div>
    <div className="flex flex-wrap items-center justify-between border-b border-border"><Tabs active="Overview" items={["Overview", "Proposed changes", "Evidence", "Evaluation", "Agent activity", "Comments"]} /><div className="mb-2"><ReviewActions runId={review.runId} status={review.rawStatus} onDecisionSaved={() => refresh()} /></div></div>
    {isRefreshing && <div className="mt-2 text-right text-xs text-foreground-muted">Refreshing review…</div>}
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_.9fr]"><div className="min-w-0 space-y-4"><Card className="min-w-0"><SectionTitle icon={<FileText className="h-4 w-4" />} title="Why this review exists" /><p className="px-4 pt-2 text-sm leading-6 text-foreground-secondary">{review.description}</p><div className="grid gap-3 p-4 sm:grid-cols-5">{[["Trigger", review.reference ?? "—"], ["Repository", review.repository ?? "—"], ["Change type", review.type ?? "—"], ["Risk level", review.risk ?? "Unknown"], ["Evaluation score", review.score === null ? "—" : `${Math.round(review.score)}%`]].map(([label, value]) => <div className="rounded-xl border border-border p-3" key={label}><div className="text-xs text-foreground-muted">{label}</div><div className="mt-2 text-sm font-semibold">{value}</div></div>)}</div></Card><Card><SectionTitle icon={<Github className="h-4 w-4" />} subtitle="Review the formatted document, its line changes, or the raw Markdown." title="Proposed changes" /><ReviewDocument files={review.files} /></Card></div><div className="min-w-0 space-y-4"><Card><SectionTitle title="Evaluation" /><div className="flex gap-4 p-4"><div className="grid h-32 w-32 shrink-0 place-items-center rounded-full border-[12px] border-success"><div className="text-center"><strong className="text-2xl">{review.score === null ? "—" : `${Math.round(review.score)}%`}</strong><div className="text-[10px] text-foreground-muted">Overall score</div></div></div><div className="flex-1 space-y-3">{review.evaluation.dimensions.length ? review.evaluation.dimensions.map((dimension, index) => { const value = percentage(dimension.value); const name = typeof dimension.name === "string" ? dimension.name : `Dimension ${index + 1}`; return <div key={`${name}-${index}`}><div className="mb-1 flex justify-between text-xs"><span>{name}</span><span>{value === null ? "—" : `${Math.round(value)}%`}</span></div>{value === null ? <div className="text-xs text-foreground-muted">Unavailable</div> : <Progress tone="green" value={value} />}</div>; }) : <p className="text-sm text-foreground-muted">No evaluation dimensions were returned.</p>}</div></div>{review.evaluation.reasons.length > 0 && <div className="border-t border-border px-4 py-3 text-xs text-foreground-muted">{review.evaluation.reasons.join(" · ")}</div>}</Card><Card><SectionTitle title="Evidence" /><div className="divide-y divide-border p-4">{review.evidence.length ? review.evidence.map((item, index) => { const title = typeof item.title === "string" ? item.title : typeof item.id === "string" ? item.id : `Evidence ${index + 1}`; const detail = typeof item.detail === "string" ? item.detail : typeof item.topic === "string" ? item.topic : "—"; const count = item.count === undefined ? "" : String(item.count); return <div className="flex items-center gap-3 py-3" key={`${title}-${index}`}><div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-muted">{item.source === "slack" ? <MessageSquare className="h-4 w-4" /> : <Github className="h-4 w-4" />}</div><div className="flex-1"><div className="text-sm font-medium">{title}</div><div className="text-xs text-foreground-muted">{detail}</div></div>{count && <span className="text-xs text-foreground-muted">{count}</span>}</div>; }) : <p className="py-3 text-sm text-foreground-muted">No structured evidence was returned.</p>}</div></Card><Card><SectionTitle title="Review decision" /><div className="space-y-3 p-4">{review.decision ? <><div className="flex items-center gap-2"><Badge tone={statusTone(review.status)}>{review.status}</Badge><span className="text-xs text-foreground-muted">{formatDate(review.updatedAt)}</span></div><p className="rounded-lg bg-surface-subtle p-3 text-sm text-foreground-secondary">{review.decisionComment || "No decision comment was provided."}</p><p className="text-xs text-foreground-muted">Decision controls are available in the toolbar while this review is pending.</p></> : <p className="text-sm text-foreground-muted">No decision has been recorded. Use the toolbar controls to approve or reject this review.</p>}</div></Card></div></div>
  </>;
}

export default ReviewDetailPage;
