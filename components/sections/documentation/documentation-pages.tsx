"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText, Github, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createDocumentationRevision,
  getDocumentation,
  getDocumentationSyncStatus,
  restoreDocumentationRevision,
  runDocumentationEvaluation,
  startDocumentationSync,
  type DocumentationDetail,
} from "@/api/documentation";
import { Badge, Button, Card, MetricCard, PageHeader, SearchBox, Tabs } from "@/components/dashboard/ui";
import { SectionTabs } from "@/components/dashboard/section-tabs";
import { useDocumentation } from "@/hooks/use-documentation";
import { useDocumentationDetail } from "@/hooks/use-documentation-detail";
import { documentationHref, documentationStatusFilter, formatDocumentationDate } from "@/lib/documentation-view-model";
import { DocumentationStatusBadge, DocumentationTable, EvaluationList, MarkdownArticle, RevisionList } from "./documentation-components";

function LoadingState({ label = "Loading documentation…" }: { label?: string }) {
  return <div role="status" aria-busy="true" className="rounded-lg border border-slate-200 p-8 text-center text-sm text-slate-500">{label}</div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800"><p>{message}</p><Button className="mt-3" onClick={onRetry}>Try again</Button></div>;
}

function SyncButton({ repository }: { repository: string | null }) {
  const [state, setState] = useState<"idle" | "running" | "done" | "failed">("idle");
  const [message, setMessage] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  useEffect(() => {
    if (!jobId) return;
    let active = true;
    const timer = window.setInterval(async () => {
      try {
        const response = await getDocumentationSyncStatus(jobId);
        if (!active) return;
        if (["completed", "failed", "cancelled"].includes(response.job.status)) {
          setState(response.job.status === "completed" ? "done" : "failed");
          setMessage(response.job.status === "completed" ? "Sync completed." : response.job.error || "Sync failed.");
          setJobId(null);
        }
      } catch (reason) {
        if (active) { setState("failed"); setMessage(reason instanceof Error ? reason.message : "Unable to read sync status"); setJobId(null); }
      }
    }, 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, [jobId]);
  async function sync() {
    if (!repository) return;
    setState("running");
    setMessage("");
    try {
      const result = await startDocumentationSync(repository);
      setState("running");
      setJobId(result.job_id);
      setMessage(`Sync job ${result.job_id} submitted.`);
    } catch (reason) {
      setState("failed");
      setMessage(reason instanceof Error ? reason.message : "Sync failed");
    }
  }
  return <div><Button primary disabled={!repository || state === "running"} onClick={sync}>{state === "running" ? "Syncing…" : "Sync repository"}</Button>{message && <p className={`mt-2 text-xs ${state === "failed" ? "text-rose-700" : "text-slate-500"}`} role={state === "failed" ? "alert" : "status"}>{message}</p>}</div>;
}

export function DocumentationListPage() {
  const { items, stats, loading, error, reload } = useDocumentation();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const repositories = useMemo(() => [...new Set(items.map((item) => item.repository).filter(Boolean))] as string[], [items]);
  const filtered = useMemo(() => items.filter((item) => {
    const text = `${item.title || ""} ${item.path} ${item.repository || ""}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (!documentationStatusFilter(status) || item.status === status);
  }), [items, query, status]);
  const firstRepository = repositories[0] || null;
  if (loading) return <><PageHeader title="Documentation" subtitle="Browse organization documentation." /><LoadingState /></>;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return <>
    <PageHeader title="Documentation" subtitle="Browse, edit, sync, and evaluate organization documentation." actions={<SyncButton repository={firstRepository} />} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Total documents" value={stats?.total ?? items.length} sub="Organization scoped" icon={<FileText className="h-5 w-5" />} />
      <MetricCard label="Up to date" value={stats?.by_status?.published ?? 0} sub="Indexed or published" tone="green" icon={<FileText className="h-5 w-5" />} />
      <MetricCard label="Needs attention" value={(stats?.by_status?.["needs-review"] ?? 0) + (stats?.by_status?.["needs-verification"] ?? 0)} sub="Review or verification" tone="amber" icon={<FileText className="h-5 w-5" />} />
      <MetricCard label="Stale" value={stats?.stale ?? 0} sub="Requires source sync" tone="rose" icon={<FileText className="h-5 w-5" />} />
    </div>
    <div className="mt-4"><SectionTabs section="documentation" /><div className="my-4 flex flex-wrap gap-2"><SearchBox className="min-w-[260px] flex-1" placeholder="Search documents…" value={query} onChange={setQuery} /><label className="sr-only" htmlFor="documentation-status">Status</label><select id="documentation-status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="all">All statuses</option><option value="indexed">Published</option><option value="needs-review">Needs review</option><option value="needs-verification">Needs verification</option><option value="stale">Stale</option></select></div>{!filtered.length ? <div role="status" className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No documentation matches these filters.</div> : <DocumentationTable items={filtered} />}</div>
  </>;
}

export function DocumentationSubpage({ kind }: { kind: string }) {
  const { items, loading, error, reload } = useDocumentation();
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const title = ({ "by-repository": "Documentation by repository", "by-topic": "Documentation by topic", outdated: "Outdated documentation", "recently-updated": "Recently updated documentation" } as Record<string, string>)[kind] || "Documentation";
  const filtered = kind === "outdated" ? items.filter((item) => item.stale || item.outdated || item.status === "stale") : kind === "recently-updated" ? [...items].sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))) : items;
  const groups = [...new Set(items.map((item) => kind === "by-topic" ? item.document_type || "general" : item.repository || "Repository unavailable"))];
  return <><PageHeader title={title} subtitle="Live organization-scoped documentation data." /><SectionTabs section="documentation" /><div className="mt-4">{kind === "by-repository" || kind === "by-topic" ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{groups.map((group) => <Card key={group} className="p-5"><h2 className="font-semibold">{group}</h2><p className="mt-1 text-xs text-slate-500">{items.filter((item) => (kind === "by-topic" ? item.document_type || "general" : item.repository || "Repository unavailable") === group).length} documents</p></Card>)}</div> : !filtered.length ? <div role="status" className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No documents in this view.</div> : <DocumentationTable items={filtered} />}</div></>;
}

export function DocumentationDetailPage({ id }: { id: string }) {
  const { document, history, evaluations, loading, error, reload } = useDocumentationDetail(id);
  const [active, setActive] = useState<"content" | "source" | "history" | "evaluations">("content");
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  if (loading) return <LoadingState label="Loading document…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!document) return <div role="status">Document not found.</div>;
  const currentDocument = document;
  async function restore(revisionId: string) { setRestoringId(revisionId); setActionMessage(""); try { await restoreDocumentationRevision(id, revisionId); setActionMessage("Revision restored as a new Draftly revision."); reload(); } catch (reason) { setActionMessage(reason instanceof Error ? reason.message : "Restore failed"); } finally { setRestoringId(null); } }
  async function evaluate() { setEvaluating(true); setActionMessage(""); try { await runDocumentationEvaluation(id, currentDocument.draft?.id); setActionMessage("Evaluation completed."); reload(); } catch (reason) { setActionMessage(reason instanceof Error ? reason.message : "Evaluation failed"); } finally { setEvaluating(false); } }
  const content = active === "source" ? document.source.content : document.effective.content;
  return <div className="-mt-1"><div className="mb-3 flex items-center gap-2 text-sm text-slate-500"><Link href="/documentation" className="inline-flex items-center gap-1 hover:text-blue-600"><ArrowLeft className="h-3.5 w-3.5" /> Documentation</Link><span>/</span><span className="truncate">{document.title || document.path}</span></div><section className="border-b border-slate-200 pb-3"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0 flex-1"><h1 className="text-3xl font-semibold tracking-tight text-slate-950">{document.title || document.path}</h1><p className="mt-1 text-sm text-slate-500">{document.repository || "Repository unavailable"} · {document.path}</p><div className="mt-3 flex flex-wrap items-center gap-2"><DocumentationStatusBadge status={document.status} />{document.draft && <Badge tone="violet">Draft revision {document.draft.revision_number}</Badge>}<Badge tone="slate">Updated {formatDocumentationDate(document.updated_at)}</Badge></div></div><div className="flex flex-wrap gap-2"><Link href={`${documentationHref(id)}/edit`}><Button>Edit</Button></Link><Button primary disabled={evaluating} onClick={evaluate}><Sparkles className="h-4 w-4" />{evaluating ? "Evaluating…" : "Run evaluation"}</Button></div></div><div className="mt-4"><Tabs active={active === "content" ? "Content" : active === "source" ? "Source" : active === "history" ? "History" : "Evaluations"} items={["Content", "Source", "History", "Evaluations"]} /></div><div className="mt-2 flex flex-wrap gap-2">{(["content", "source", "history", "evaluations"] as const).map((tab) => <Button key={tab} className={active === tab ? "bg-blue-50 text-blue-700" : ""} onClick={() => setActive(tab)}>{tab[0].toUpperCase() + tab.slice(1)}</Button>)}</div></section>{actionMessage && <p role="status" className="mt-3 text-sm text-slate-600">{actionMessage}</p>}<div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"><Card className="p-5 md:p-7">{active === "history" ? <><h2 className="mb-3 text-lg font-semibold">Draftly revision history</h2><RevisionList revisions={history} onRestore={restore} restoringId={restoringId} /></> : active === "evaluations" ? <><h2 className="mb-3 text-lg font-semibold">Document evaluations</h2><EvaluationList evaluations={evaluations} /></> : <MarkdownArticle content={content} />}</Card><aside className="space-y-4"><Card className="p-4"><h2 className="font-semibold">Source metadata</h2><dl className="mt-3 space-y-2 text-xs text-slate-600"><div><dt className="text-slate-400">Commit</dt><dd>{document.source.commit_sha || "Not available"}</dd></div><div><dt className="text-slate-400">Source hash</dt><dd className="break-all">{document.source.source_hash || "Not available"}</dd></div><div><dt className="text-slate-400">Branch</dt><dd>{document.metadata?.branch || "Not available"}</dd></div></dl></Card><Card className="p-4"><div className="flex items-center gap-2"><Github className="h-4 w-4 text-blue-600" /><h2 className="font-semibold">Repository</h2></div><p className="mt-2 text-sm text-slate-600">{document.repository || "Repository unavailable"}</p></Card></aside></div></div>;
}

export function DocumentationEditPage({ id }: { id: string }) {
  const router = useRouter();
  const [document, setDocument] = useState<DocumentationDetail | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getDocumentation(id).then((value) => { setDocument(value); setContent(value.effective.content); setTitle(value.title || ""); }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Failed to load document")).finally(() => setLoading(false)); }, [id]);
  async function save() { if (!document) return; setSaving(true); setError(null); try { await createDocumentationRevision(id, { content, title: title || null, base_source_hash: document.source.source_hash, base_revision_id: document.draft?.id || null }); router.push(documentationHref(id)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Save failed"); } finally { setSaving(false); } }
  if (loading) return <LoadingState label="Loading editor…" />;
  if (error && !document) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  return <><Link href={documentationHref(id)} className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500"><ArrowLeft className="h-4 w-4" /> Back to document</Link><PageHeader title="Edit documentation" subtitle="Save an immutable Draftly revision with optimistic conflict protection." actions={<Button primary disabled={saving} onClick={save}><Save className="h-4 w-4" />{saving ? "Saving…" : "Save changes"}</Button>} />{error && <p role="alert" className="my-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}<div className="mb-3"><label htmlFor="document-title" className="text-sm font-medium">Title</label><input id="document-title" value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></div><Card className="overflow-hidden"><div className="grid min-h-[620px] md:grid-cols-2"><div className="border-b border-slate-200 md:border-b-0 md:border-r"><label htmlFor="document-content" className="block border-b border-slate-100 px-4 py-3 text-xs font-semibold">MARKDOWN</label><textarea id="document-content" value={content} onChange={(event) => setContent(event.target.value)} className="h-[570px] w-full resize-none p-4 font-mono text-sm leading-6 outline-none" /></div><div><div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold">PREVIEW</div><div className="p-6"><MarkdownArticle content={content} /></div></div></div></Card></>;
}
