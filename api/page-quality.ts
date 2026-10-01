import { request } from "./client.ts";

export interface PageQualityMetric {
  metric: string;
  average_score: number | null;
  sample_count: number;
}

export interface PageQualityTrendPoint {
  date: string;
  average_score: number | null;
  run_count: number;
}

export interface PageQualitySummary {
  average_score: number | null;
  total_runs: number;
  scored_pages: number;
  total_pages: number;
  passed: number;
  needs_revision: number;
  awaiting_human: number;
  by_metric: PageQualityMetric[];
  trend: PageQualityTrendPoint[];
}

export interface QualityPageItem {
  page_id: string;
  path: string | null;
  status: string | null;
  score: number | null;
  run_id: string;
  updated_at: string | null;
}

export interface QualityPage {
  items: QualityPageItem[];
  total: number;
  next_cursor: string | null;
}

export async function getPageQualitySummary(days: 1 | 7 | 14 | 30 = 14) {
  return request<PageQualitySummary>(`/evaluations/summary?days=${days}`);
}

export async function listQualityPages(options: { limit?: number; cursor?: string } = {}) {
  const params = new URLSearchParams();
  if (options.limit != null) params.set("limit", String(options.limit));
  if (options.cursor) params.set("cursor", options.cursor);
  const suffix = params.toString();
  return request<QualityPage>(`/evaluations/pages${suffix ? `?${suffix}` : ""}`);
}
