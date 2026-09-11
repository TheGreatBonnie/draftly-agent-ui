"use client";

import Link from "next/link";
import { FileText, Github, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge, Button, Card, IconTile } from "@/components/dashboard/ui";
import type {
  DocumentationEvaluation,
  DocumentationRecord,
  DocumentationRevision,
} from "@/api/documentation";
import { documentationHref, documentationStatusLabel, formatDocumentationDate } from "@/lib/documentation-view-model";

export function DocumentationStatusBadge({ status }: { status: string | null }) {
  const label = documentationStatusLabel(status);
  const tone = status === "stale" ? "rose" : status === "needs-review" ? "amber" : status === "indexed" || status === "published" ? "green" : "blue";
  return <Badge tone={tone}>{label}</Badge>;
}

export function DocumentationTable({ items }: { items: DocumentationRecord[] }) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((document) => (
          <div key={document.id} className="flex flex-col gap-3 px-4 py-4 text-xs sm:flex-row sm:items-center">
            <IconTile size="sm"><FileText className="h-4 w-4" /></IconTile>
            <div className="min-w-0 flex-1">
              <Link href={documentationHref(document.id)} className="block truncate text-sm font-medium hover:text-blue-600">
                {document.title || document.path}
              </Link>
              <div className="truncate text-slate-500">{document.path}</div>
            </div>
            <span className="inline-flex items-center gap-1 truncate text-slate-600"><Github className="h-3.5 w-3.5" />{document.repository || "Repository unavailable"}</span>
            <span><Badge tone="slate">{document.document_type || "general"}</Badge></span>
            <DocumentationStatusBadge status={document.status} />
            <span className="text-slate-500">{formatDocumentationDate(document.updated_at)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MarkdownArticle({ content }: { content: string }) {
  return <article className="prose prose-slate max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown></article>;
}

export function RevisionList({ revisions, onRestore, restoringId }: { revisions: DocumentationRevision[]; onRestore?: (id: string) => void; restoringId?: string | null }) {
  if (!revisions.length) return <p role="status" className="text-sm text-slate-500">No Draftly revisions yet.</p>;
  return <div className="divide-y divide-slate-100">{revisions.map((revision) => (
    <div key={revision.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div><div className="text-sm font-medium">Revision {revision.revision_number} · {revision.origin}</div><div className="text-xs text-slate-500">{formatDocumentationDate(revision.created_at)} · {revision.status}</div></div>
      {onRestore && <Button disabled={Boolean(restoringId)} onClick={() => onRestore(revision.id)}><RotateCcw className="h-3.5 w-3.5" />{restoringId === revision.id ? "Restoring…" : "Restore"}</Button>}
    </div>
  ))}</div>;
}

export function EvaluationList({ evaluations }: { evaluations: DocumentationEvaluation[] }) {
  if (!evaluations.length) return <p role="status" className="text-sm text-slate-500">No evaluations have been run for this document.</p>;
  return <div className="divide-y divide-slate-100">{evaluations.map((evaluation) => (
    <div key={evaluation.id} className="flex items-center justify-between gap-3 py-3 text-sm"><div><div className="font-medium">{evaluation.status}</div><div className="text-xs text-slate-500">{formatDocumentationDate(evaluation.completed_at)}</div></div><Badge tone={evaluation.passed ? "green" : "amber"}>{evaluation.score}%</Badge></div>
  ))}</div>;
}
