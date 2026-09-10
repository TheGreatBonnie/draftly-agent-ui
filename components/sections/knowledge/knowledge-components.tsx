"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  Boxes,
  Database,
  FileText,
  GitBranch,
  Network,
  RefreshCw,
  Search,
  Tags,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconTile,
  MetricCard,
  Progress,
  SearchBox,
  SectionTitle,
} from "@/components/dashboard/ui";
import {
  type KnowledgeGraph,
  type KnowledgeEmbeddingStats,
  type KnowledgeListItem,
  type KnowledgeSourceSummary,
  type KnowledgeStatus,
  type KnowledgeTopic,
} from "@/api/knowledge";
import { useKnowledge } from "@/hooks/use-knowledge";
import { useKnowledgeDetail } from "@/hooks/use-knowledge-detail";
import { useKnowledgeSurfaces } from "@/hooks/use-knowledge-surfaces";
import {
  formatKnowledgeCount,
  formatKnowledgeTime,
  knowledgeItemDescription,
  knowledgeItemTitle,
  knowledgeStatusLabel,
} from "@/lib/knowledge-view-model";

const tabs = [
  { label: "Overview", href: "/knowledge" },
  { label: "Documents", href: "/knowledge/documents" },
  { label: "Sources", href: "/knowledge/sources" },
  { label: "Knowledge Graph", href: "/knowledge/graph" },
  { label: "Topics", href: "/knowledge/topics" },
  { label: "Embeddings", href: "/knowledge/embeddings" },
];

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="p-6 text-sm text-danger">
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        {onRetry && <Button onClick={onRetry}><RefreshCw className="h-4 w-4" />Retry</Button>}
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: KnowledgeStatus }) {
  const tone = status === "verified" ? "green" : status === "stale" ? "rose" : "amber";
  return <Badge tone={tone}>{knowledgeStatusLabel(status)}</Badge>;
}

function ItemRow({ item }: { item: KnowledgeListItem }) {
  return (
    <Link
      href={`/knowledge/item/${encodeURIComponent(item.id)}`}
      className="grid gap-3 border-b border-border p-4 transition hover:bg-surface-subtle sm:grid-cols-[minmax(0,1.5fr)_120px_120px_100px]"
    >
      <div className="flex min-w-0 gap-3">
        <IconTile size="sm"><FileText className="h-4 w-4" /></IconTile>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{knowledgeItemTitle(item)}</div>
          <div className="truncate text-xs text-foreground-muted">{knowledgeItemDescription(item)}</div>
        </div>
      </div>
      <StatusBadge status={item.status} />
      <span className="text-xs text-foreground-muted">{item.memory_type}</span>
      <span className="text-xs text-foreground-muted">{formatKnowledgeTime(item.updated_at)}</span>
    </Link>
  );
}

function GraphCard({ graph }: { graph: KnowledgeGraph | null }) {
  const nodes = graph?.nodes ?? [];
  return (
    <Card className="overflow-hidden">
      <SectionTitle
        icon={<GitBranch className="h-4 w-4" />}
        title="Knowledge graph"
        subtitle={`${formatKnowledgeCount(nodes.length)} nodes and ${formatKnowledgeCount(graph?.edges.length)} relationships`}
        action={<Link href="/knowledge/graph" className="text-xs font-medium text-brand hover:underline">Explore</Link>}
      />
      {nodes.length === 0 ? (
        <div className="p-6 text-sm text-foreground-muted">No graph relationships have been indexed yet.</div>
      ) : (
        <div className="grid gap-2 p-4 sm:grid-cols-2">
          {nodes.slice(0, 8).map((node) => (
            <Link key={node.id} href={`/knowledge/item/${encodeURIComponent(node.id)}`} className="flex min-w-0 items-center gap-2 rounded-lg border border-border p-2 hover:bg-surface-subtle">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600"><Network className="h-3.5 w-3.5" /></span>
              <span className="truncate text-xs font-medium">{node.label}</span>
              <span className="ml-auto text-[10px] text-foreground-muted">{node.memory_type}</span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

function SourceCard({ source }: { source: KnowledgeSourceSummary }) {
  return (
    <div className="flex items-center gap-3 border-b border-border p-3 last:border-0">
      <IconTile size="sm" tone="violet"><Database className="h-4 w-4" /></IconTile>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium">{source.source_type}</div>
        <div className="truncate text-[11px] text-foreground-muted">{source.repository || "Repository not specified"}</div>
      </div>
      <div className="text-right text-[11px] text-foreground-muted">
        <div>{formatKnowledgeCount(source.item_count)} items</div>
        <div>{formatKnowledgeTime(source.last_seen_at)}</div>
      </div>
    </div>
  );
}

export function KnowledgeOverview() {
  const knowledge = useKnowledge();
  const surfaces = useKnowledgeSurfaces();
  const stats = knowledge.stats;
  const sources = surfaces.sources;
  const topics = surfaces.topics.items;
  const items = knowledge.items.slice(0, 5);
  const error = knowledge.error || surfaces.error;

  return (
    <>
      {error && <ErrorState message={error} onRetry={knowledge.reload} />}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Knowledge items" value={formatKnowledgeCount(stats?.total)} sub="Organization-scoped items" icon={<FileText className="h-5 w-5" />} />
        <MetricCard label="Verified" value={formatKnowledgeCount(stats?.verified)} sub="Above the confidence threshold" tone="green" icon={<BookOpen className="h-5 w-5" />} />
        <MetricCard label="Needs verification" value={formatKnowledgeCount(stats?.needs_verification)} sub="Below the confidence threshold" tone="amber" icon={<Tags className="h-5 w-5" />} />
        <MetricCard label="Stale" value={formatKnowledgeCount(stats?.stale)} sub="Marked stale by the pipeline" tone="rose" icon={<GitBranch className="h-5 w-5" />} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_.85fr]">
        <div className="space-y-4">
          <GraphCard graph={surfaces.graph} />
          <Card className="overflow-hidden">
            <SectionTitle icon={<FileText className="h-4 w-4" />} title="Recent knowledge items" subtitle="Latest items persisted for this organization." action={<Link href="/knowledge/documents" className="text-xs font-medium text-brand hover:underline">View all</Link>} />
            <div className="mt-2 px-5">{knowledge.loading && !items.length ? <div className="p-5 text-sm text-foreground-muted">Loading knowledge…</div> : items.length ? items.map((item) => <ItemRow key={item.id} item={item} />) : <div className="p-5 text-sm text-foreground-muted">No knowledge items found.</div>}</div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <SectionTitle icon={<GitBranch className="h-4 w-4" />} title="Knowledge sources" subtitle="Provenance evidence grouped by source." action={<Link href="/knowledge/sources" className="text-xs font-medium text-brand hover:underline">View all</Link>} />
            <div className="mt-2">{sources.length ? sources.slice(0, 6).map((source) => <SourceCard key={`${source.source_type}-${source.repository}`} source={source} />) : <div className="p-5 text-sm text-foreground-muted">No provenance has been recorded yet.</div>}</div>
          </Card>
          <Card>
            <SectionTitle icon={<BookOpen className="h-4 w-4" />} title="Top topics" action={<Link href="/knowledge/topics" className="text-xs font-medium text-brand hover:underline">View all</Link>} />
            <div className="space-y-3 p-4">{topics.length ? topics.slice(0, 5).map((topic, index) => <TopicRow key={topic.name} topic={topic} index={index} />) : <div className="text-sm text-foreground-muted">No topic metadata has been indexed.</div>}</div>
          </Card>
        </div>
      </div>
    </>
  );
}

function TopicRow({ topic, index }: { topic: KnowledgeTopic; index: number }) {
  const coverage = topic.item_count ? (topic.verified_count / topic.item_count) * 100 : 0;
  return <div className="grid grid-cols-[18px_1fr_90px_28px] items-center gap-2 text-xs"><span>{index + 1}</span><span className="truncate">{topic.name}</span><Progress value={coverage} tone="blue" /><span>{formatKnowledgeCount(topic.item_count)}</span></div>;
}

export function KnowledgeList() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<KnowledgeStatus | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const { items, page, loading, error, reload } = useKnowledge({ status, query, cursor });
  useEffect(() => setCursor(undefined), [query, status]);
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <SearchBox className="min-w-[220px] flex-1" placeholder="Search indexed knowledge…" value={query} onChange={setQuery} />
        <label className="sr-only" htmlFor="knowledge-status">Filter by status</label>
        <select id="knowledge-status" value={status ?? "all"} onChange={(event) => setStatus(event.target.value === "all" ? undefined : event.target.value as KnowledgeStatus)} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground-secondary">
          <option value="all">All statuses</option><option value="verified">Verified</option><option value="needs-verification">Needs verification</option><option value="stale">Stale</option>
        </select>
        <Button onClick={reload}><RefreshCw className="h-4 w-4" />Refresh</Button>
      </div>
      {error && <ErrorState message={error} onRetry={reload} />}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 text-xs text-foreground-muted"><span>{loading ? "Loading…" : `${formatKnowledgeCount(page?.total)} items`}</span><span>{query.trim() ? <><Search className="mr-1 inline h-3 w-3" />Semantic search</> : "Updated recently"}</span></div>
        {items.length ? items.map((item) => <ItemRow key={item.id} item={item} />) : <div className="p-8 text-center text-sm text-foreground-muted">{loading ? "Loading knowledge…" : "No knowledge items match this view."}</div>}
        {page?.next_cursor && <div className="flex justify-center border-t border-border p-4"><Button onClick={() => setCursor(page.next_cursor ?? undefined)} disabled={loading}>Load next page</Button></div>}
      </Card>
    </>
  );
}

export function KnowledgeSurface({ section }: { section: string }) {
  const surfaces = useKnowledgeSurfaces();
  if (surfaces.error && section !== "documents") return <ErrorState message={surfaces.error} />;
  if (section === "documents") return <KnowledgeList />;
  if (section === "sources") return <SourcesSurface sources={surfaces.sources} loading={surfaces.loading} />;
  if (section === "graph") return <GraphSurface graph={surfaces.graph} loading={surfaces.loading} />;
  if (section === "topics") return <TopicsSurface topics={surfaces.topics.items} loading={surfaces.loading} />;
  return <EmbeddingsSurface data={surfaces.embeddings} loading={surfaces.loading} />;
}

function SourcesSurface({ sources, loading }: { sources: KnowledgeSourceSummary[]; loading: boolean }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{loading && !sources.length ? <Card className="p-6 text-sm text-foreground-muted">Loading sources…</Card> : sources.length ? sources.map((source) => <Card key={`${source.source_type}-${source.repository}`}><SourceCard source={source} /><dl className="grid grid-cols-2 gap-y-2 p-4 pt-1 text-xs"><dt className="text-foreground-muted">Evidence rows</dt><dd>{formatKnowledgeCount(source.evidence_count)}</dd><dt className="text-foreground-muted">Indexed items</dt><dd>{formatKnowledgeCount(source.item_count)}</dd></dl></Card>) : <EmptyState icon={<Database className="h-6 w-6" />} title="No provenance yet" description="Knowledge items will appear here once their ingestion pipeline records source evidence." />}</div>;
}

function GraphSurface({ graph, loading }: { graph: KnowledgeGraph | null; loading: boolean }) {
  if (loading && !graph) return <Card className="p-6 text-sm text-foreground-muted">Loading graph…</Card>;
  return <GraphCard graph={graph} />;
}

function TopicsSurface({ topics, loading }: { topics: KnowledgeTopic[]; loading: boolean }) {
  return <div className="grid gap-4 lg:grid-cols-[1fr_320px]">{loading && !topics.length ? <Card className="p-6 text-sm text-foreground-muted">Loading topics…</Card> : <><Card className="overflow-hidden"><SectionTitle icon={<Tags className="h-4 w-4" />} title="Knowledge topics" /><div className="divide-y divide-border">{topics.map((topic, index) => <div key={topic.name} className="grid gap-3 p-4 sm:grid-cols-[1fr_120px_120px_120px]"><div className="flex items-center gap-3"><IconTile size="sm" tone={index % 2 ? "violet" : "blue"}><Tags className="h-4 w-4" /></IconTile><span className="text-sm font-medium">{topic.name}</span></div><div className="text-xs"><span className="text-foreground-muted">Items</span><div>{formatKnowledgeCount(topic.item_count)}</div></div><div className="text-xs"><span className="text-foreground-muted">Verified</span><div>{formatKnowledgeCount(topic.verified_count)}</div></div><div className="text-xs"><span className="text-foreground-muted">Stale</span><div>{formatKnowledgeCount(topic.stale_count)}</div></div></div>)}</div></Card><Card className="p-4"><h3 className="font-semibold">Verified coverage</h3><div className="mt-4 space-y-4">{topics.slice(0, 8).map((topic) => <div key={topic.name}><div className="mb-1 flex justify-between text-xs"><span>{topic.name}</span><span>{topic.item_count ? Math.round(topic.verified_count / topic.item_count * 100) : 0}%</span></div><Progress value={topic.item_count ? topic.verified_count / topic.item_count * 100 : 0} /></div>)}</div></Card></>}</div>;
}

function EmbeddingsSurface({ data, loading }: { data: KnowledgeEmbeddingStats | null; loading: boolean }) {
  if (loading && !data) return <Card className="p-6 text-sm text-foreground-muted">Loading embedding coverage…</Card>;
  if (!data) return <EmptyState icon={<Boxes className="h-6 w-6" />} title="No embedding data" description="Embedding coverage is not available for this organization yet." />;
  return <Card className="p-5"><div className="flex items-center gap-3"><IconTile size="lg" tone="violet"><Boxes className="h-7 w-7" /></IconTile><div><h3 className="font-semibold">Embedding coverage</h3><p className="text-sm text-foreground-muted">Operational coverage for semantic Knowledge search.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Knowledge items", formatKnowledgeCount(data.total_items)], ["Embedded items", formatKnowledgeCount(data.embedded_items)], ["Coverage", `${data.coverage_percent}%`], ["Last embedded", formatKnowledgeTime(data.last_embedded_at)]].map(([label, value]) => <div key={label} className="rounded-xl border border-border p-3"><div className="text-xs text-foreground-muted">{label}</div><div className="mt-1 text-lg font-semibold">{value}</div></div>)}</div><div className="mt-5 text-xs text-foreground-muted">Models: {data.models.length ? data.models.join(", ") : "No model metadata recorded"}</div></Card>;
}

export function KnowledgeDetailView({ id }: { id: string }) {
  const { data, loading, error } = useKnowledgeDetail(id);
  if (loading) return <Card className="p-6 text-sm text-foreground-muted">Loading knowledge item…</Card>;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState icon={<FileText className="h-6 w-6" />} title="Knowledge item not found" description="This item may have been removed or is not available to your organization." />;
  return <div className="space-y-4"><Card className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><Link href="/knowledge/documents" className="text-xs text-brand hover:underline">← Back to Knowledge</Link><h2 className="mt-3 text-xl font-semibold">{data.entity || "Untitled knowledge item"}</h2><p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm text-foreground-secondary">{data.description || "No description available."}</p></div><StatusBadge status={data.status} /></div><dl className="mt-5 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-4"><div><dt className="text-foreground-muted">Confidence</dt><dd className="mt-1 font-medium">{data.confidence == null ? "Unknown" : `${Math.round(data.confidence * 100)}%`}</dd></div><div><dt className="text-foreground-muted">Importance</dt><dd className="mt-1 font-medium">{data.importance == null ? "Unknown" : data.importance}</dd></div><div><dt className="text-foreground-muted">Created</dt><dd className="mt-1 font-medium">{formatKnowledgeTime(data.created_at)}</dd></div><div><dt className="text-foreground-muted">Updated</dt><dd className="mt-1 font-medium">{formatKnowledgeTime(data.updated_at)}</dd></div></dl></Card><div className="grid gap-4 lg:grid-cols-3"><DetailCollection title="Sources" count={data.sources.length}>{data.sources.map((source) => <div key={source.id} className="border-b border-border p-3 text-xs last:border-0"><div className="font-medium">{source.source_type}</div><div className="mt-1 text-foreground-muted">{source.repository || source.source_url || source.source_id || "Unspecified source"}</div><div className="mt-1 text-foreground-secondary">{source.evidence || "No evidence excerpt"}</div></div>)}</DetailCollection><DetailCollection title="Related" count={data.related.length}>{data.related.map((link) => <div key={link.id} className="border-b border-border p-3 text-xs last:border-0"><div className="font-medium">{link.relationship}</div><Link className="mt-1 block truncate text-brand hover:underline" href={`/knowledge/item/${encodeURIComponent(link.target_memory_id)}`}>{link.target_memory_id}</Link></div>)}</DetailCollection><DetailCollection title="Feedback" count={data.feedback.length}>{data.feedback.map((feedback) => <div key={feedback.id} className="border-b border-border p-3 text-xs last:border-0"><div className="font-medium">{feedback.feedback_type}</div><div className="mt-1 text-foreground-muted">{feedback.source || "Unknown source"} · {feedback.score == null ? "No score" : feedback.score}</div><div className="mt-1 text-foreground-secondary">{feedback.comment || "No comment"}</div></div>)}</DetailCollection></div></div>;
}

function DetailCollection({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-border p-4"><h3 className="font-semibold">{title}</h3><Badge tone="slate">{count}</Badge></div>{count ? children : <div className="p-4 text-xs text-foreground-muted">No {title.toLowerCase()} recorded.</div>}</Card>;
}

export { tabs as knowledgeTabs };
