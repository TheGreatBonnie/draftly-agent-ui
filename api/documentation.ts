import { request } from "./client.ts";

export type DocumentationStatus =
  | "published"
  | "needs-review"
  | "needs-verification"
  | "stale"
  | "indexed"
  | "draft";

export interface DocumentationRecord {
  id: string;
  org_id: string | null;
  repository: string | null;
  path: string;
  title: string | null;
  content?: string;
  document_type: string | null;
  version: number | null;
  commit_sha: string | null;
  source_hash: string | null;
  status: string | null; // DB status (e.g. "indexed")
  metadata: {
    branch?: string | null;
    source_url?: string | null;
    chunk_count?: number | null;
    section_count?: number | null;
  };
  stale: boolean;
  outdated: boolean;
  incomplete: boolean;
  broken_links: boolean;
  unsupported_claims: boolean;
  created_at: string | null;
  updated_at: string | null;
  last_committed_at: string | null;
  last_verified_at: string | null;
  draft_revision_id?: string | null;
  has_draft?: boolean;
}

export interface DocumentationSource {
  content: string;
  source_hash: string | null;
  commit_sha: string | null;
}

export interface DocumentationRevision {
  id: string;
  document_id: string;
  org_id: string;
  revision_number: number;
  origin: "manual" | "restore";
  status: "draft" | "superseded" | "discarded";
  title: string | null;
  content: string;
  base_source_hash: string | null;
  created_by: string;
  created_at: string;
}

export interface DocumentationDetail extends DocumentationRecord {
  source: DocumentationSource;
  draft: DocumentationRevision | null;
  effective: {
    kind: "source" | "draft";
    revision_id: string | null;
    content: string;
  };
}

export interface RevisionPage {
  items: DocumentationRevision[];
  total: number;
  next_cursor: string | null;
}

export interface DocumentationEvaluation {
  id: string;
  org_id: string;
  evaluation_type: string;
  target_id: string;
  score: number;
  passed: boolean;
  status: string;
  metrics: Record<string, unknown>;
  failures: Record<string, unknown>[];
  started_at: string | null;
  completed_at: string | null;
  trace_id?: string | null;
}

export interface DocumentationSyncJob {
  id?: string;
  run_id?: string;
  org_id?: string;
  name?: string;
  status: string;
  error?: string | null;
  result?: Record<string, unknown> | null;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface DocumentationStats {
  total: number;
  by_status: Record<string, number>;
  stale: number;
  outdated: number;
  incomplete: number;
  broken_links: number;
  unsupported_claims: number;
}

export async function listDocumentation(opts?: {
  status?: DocumentationStatus;
  limit?: number;
  repository?: string;
  query?: string;
  cursor?: string;
}): Promise<{ items: DocumentationRecord[]; total?: number; next_cursor?: string | null }> {
  const params = new URLSearchParams();
  if (opts?.status) params.set("status", opts.status);
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.repository) params.set("repository", opts.repository);
  if (opts?.query) params.set("query", opts.query);
  if (opts?.cursor) params.set("cursor", opts.cursor);
  const qs = params.toString();
  return request(qs ? `/documentation?${qs}` : "/documentation");
}

export async function getDocumentationStats(): Promise<DocumentationStats> {
  return request("/documentation/stats");
}

export async function getDocumentation(
  id: string,
): Promise<DocumentationDetail> {
  return request(`/documentation/${encodeURIComponent(id)}`);
}

export async function createDocumentationRevision(
  id: string,
  payload: {
    content: string;
    title?: string | null;
    base_source_hash?: string | null;
    base_revision_id?: string | null;
  },
): Promise<{ revision: DocumentationRevision }> {
  return request(`/documentation/${encodeURIComponent(id)}/revisions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDocumentationHistory(
  id: string,
  opts?: { limit?: number; cursor?: string },
): Promise<RevisionPage> {
  const params = new URLSearchParams();
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.cursor) params.set("cursor", opts.cursor);
  const query = params.toString();
  return request(`/documentation/${encodeURIComponent(id)}/history${query ? `?${query}` : ""}`);
}

export async function restoreDocumentationRevision(
  id: string,
  revisionId: string,
): Promise<{ revision: DocumentationRevision }> {
  return request(
    `/documentation/${encodeURIComponent(id)}/revisions/${encodeURIComponent(revisionId)}/restore`,
    { method: "POST" },
  );
}

export async function startDocumentationSync(
  repositoryFullName: string,
  payload?: { include?: string[]; exclude?: string[] },
): Promise<{ job_id: string; run_id: string; status: string }> {
  return request("/documentation/sync", {
    method: "POST",
    body: JSON.stringify({
      repository_full_name: repositoryFullName,
      ...payload,
    }),
  });
}

export async function getDocumentationSyncStatus(
  jobId: string,
): Promise<{ job: DocumentationSyncJob }> {
  return request(`/documentation/sync/${encodeURIComponent(jobId)}`);
}

export async function getDocumentationEvaluations(
  id: string,
  limit = 20,
): Promise<{ items: DocumentationEvaluation[]; total?: number }> {
  return request(
    `/documentation/${encodeURIComponent(id)}/evaluations?limit=${encodeURIComponent(String(limit))}`,
  );
}

export async function runDocumentationEvaluation(
  id: string,
  revisionId?: string,
): Promise<{ evaluation: DocumentationEvaluation; result: Record<string, unknown> }> {
  return request(`/documentation/${encodeURIComponent(id)}/evaluations`, {
    method: "POST",
    body: JSON.stringify(revisionId ? { revision_id: revisionId } : {}),
  });
}
