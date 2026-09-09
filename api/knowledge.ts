import { request } from "./client";

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
  similarity?: number;
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

export async function listKnowledge(
  status?: KnowledgeStatus,
): Promise<{ items: KnowledgeListItem[] }> {
  return request(status ? `/knowledge?status=${status}` : "/knowledge");
}

export async function getKnowledgeStats(): Promise<KnowledgeStats> {
  return request("/knowledge/stats");
}

export async function searchKnowledge(
  q: string,
  limit = 20,
): Promise<{ query: string; items: KnowledgeListItem[] }> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  return request(`/knowledge/search?${params.toString()}`);
}

export async function getKnowledgeDetail(
  id: string,
): Promise<KnowledgeDetail> {
  return request(`/knowledge/${encodeURIComponent(id)}`);
}