import { request } from "./client.ts";

export type KnowledgeStatus = "verified" | "needs-verification" | "stale";

export interface KnowledgeListItem {
  id: string;
  entity: string | null;
  description: string | null;
  status: KnowledgeStatus;
  importance: number | null;
  confidence: number | null;
  updated_at: string | null;
  created_at: string | null;
  namespace: string;
  memory_type: string;
  similarity?: number | null;
}

export interface KnowledgePage {
  items: KnowledgeListItem[];
  total: number;
  next_cursor: string | null;
}

export interface KnowledgeStats {
  total: number;
  verified: number;
  needs_verification: number;
  stale: number;
}

export interface KnowledgeSource {
  id: string;
  source_type: string;
  source_id: string | null;
  source_url: string | null;
  repository: string | null;
  commit_sha: string | null;
  evidence: string | null;
}

export interface KnowledgeLink {
  id: string;
  relationship: string;
  source_memory_id: string;
  target_memory_id: string;
  confidence: number | null;
}

export interface KnowledgeFeedback {
  id: string;
  feedback_type: string;
  source: string | null;
  score: number | null;
  comment: string | null;
  created_at: string | null;
}

export interface KnowledgeDetail {
  id: string;
  entity: string | null;
  description: string | null;
  status: KnowledgeStatus;
  importance: number | null;
  confidence: number | null;
  created_at: string | null;
  updated_at: string | null;
  sources: KnowledgeSource[];
  related: KnowledgeLink[];
  feedback: KnowledgeFeedback[];
}

export interface KnowledgeSourceSummary {
  source_type: string;
  repository: string | null;
  item_count: number;
  evidence_count: number;
  last_seen_at: string | null;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  status: KnowledgeStatus;
  memory_type: string;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  relationship: string;
  confidence: number | null;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface KnowledgeTopic {
  name: string;
  item_count: number;
  verified_count: number;
  stale_count: number;
}

export interface KnowledgeTopics {
  items: KnowledgeTopic[];
}

export interface KnowledgeEmbeddingStats {
  total_items: number;
  embedded_items: number;
  coverage_percent: number;
  models: string[];
  last_embedded_at: string | null;
}

export async function listKnowledge(
  options: {
    status?: KnowledgeStatus;
    limit?: number;
    cursor?: string;
    signal?: AbortSignal;
  } = {},
): Promise<KnowledgePage> {
  const params = new URLSearchParams({ limit: String(options.limit ?? 25) });
  if (options.status) params.set("status", options.status);
  if (options.cursor) params.set("cursor", options.cursor);
  return request<KnowledgePage>(`/knowledge?${params.toString()}`, {
    signal: options.signal,
  });
}

export async function getKnowledgeStats(signal?: AbortSignal): Promise<KnowledgeStats> {
  return request<KnowledgeStats>("/knowledge/stats", { signal });
}

export async function searchKnowledge(
  q: string,
  limit = 20,
  signal?: AbortSignal,
  status?: KnowledgeStatus,
): Promise<{ query: string; items: KnowledgeListItem[]; total: number }> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  if (status) params.set("status", status);
  return request(`/knowledge/search?${params.toString()}`, { signal });
}

export async function getKnowledgeDetail(
  id: string,
  signal?: AbortSignal,
): Promise<KnowledgeDetail> {
  return request<KnowledgeDetail>(`/knowledge/${encodeURIComponent(id)}`, { signal });
}

export async function getKnowledgeSources(signal?: AbortSignal): Promise<KnowledgeSourceSummary[]> {
  return request<KnowledgeSourceSummary[]>("/knowledge/sources", { signal });
}

export async function getKnowledgeGraph(signal?: AbortSignal): Promise<KnowledgeGraph> {
  return request<KnowledgeGraph>("/knowledge/graph", { signal });
}

export async function getKnowledgeTopics(signal?: AbortSignal): Promise<KnowledgeTopics> {
  return request<KnowledgeTopics>("/knowledge/topics", { signal });
}

export async function getKnowledgeEmbeddingStats(signal?: AbortSignal): Promise<KnowledgeEmbeddingStats> {
  return request<KnowledgeEmbeddingStats>("/knowledge/embeddings", { signal });
}
