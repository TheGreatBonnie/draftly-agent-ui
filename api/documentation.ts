import { request } from "./client";

export type DocumentationStatus =
  | "published"
  | "needs-review"
  | "needs-verification"
  | "stale";

export interface DocumentationRecord {
  id: string;
  org_id: string | null;
  repository: string | null;
  path: string;
  title: string | null;
  content: string;
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
}): Promise<{ items: DocumentationRecord[] }> {
  const params = new URLSearchParams();
  if (opts?.status) params.set("status", opts.status);
  if (opts?.limit) params.set("limit", String(opts.limit));
  const qs = params.toString();
  return request(qs ? `/documentation?${qs}` : "/documentation");
}

export async function getDocumentationStats(): Promise<DocumentationStats> {
  return request("/documentation/stats");
}

export async function getDocumentation(
  id: string,
): Promise<DocumentationRecord> {
  return request(`/documentation/${encodeURIComponent(id)}`);
}