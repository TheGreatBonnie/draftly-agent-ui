import { request } from "./client";

export type ContentStatus = "draft" | "in_review" | "approved" | "rejected";
export type ContentChannel = "blog" | "linkedin" | "x";

export interface ContentVariant {
  id: string;
  channel: ContentChannel;
  title: string;
  body: string;
  status: ContentStatus;
  evidence: Record<string, unknown>[];
  evaluation: Record<string, unknown>;
}

export interface ContentPackage {
  id: string;
  brief: string;
  status: ContentStatus;
  source_event_type: string;
  source_gap_id: string | null;
  source_feedback_ids: string[];
  variants: ContentVariant[];
}

export function listContent(status?: ContentStatus) {
  return request<{ items: ContentPackage[] }>(
    status ? `/content?status=${status}` : "/content",
  );
}

export function reviewContent(
  id: string,
  decision: "approve" | "request_changes" | "reject",
  comment?: string,
) {
  return request<{ package_id: string; status: ContentStatus }>(
    `/content/${encodeURIComponent(id)}/review`,
    { method: "POST", body: JSON.stringify({ decision, comment }) },
  );
}
