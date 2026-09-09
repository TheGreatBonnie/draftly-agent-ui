import type {
  ReviewDisplay,
  ReviewDisplayEvaluation,
  ReviewDisplayFile,
  ReviewEvidenceItem,
  ReviewSummary,
} from "../api/observability";

export interface ReviewViewModel {
  id: string;
  runId: string;
  title: string;
  reference: string | null;
  description: string;
  repository: string | null;
  path: string | null;
  type: string | null;
  risk: string | null;
  score: number | null;
  evaluationCount: number | null;
  status: string;
  rawStatus: string;
  decision: string | null;
  decisionComment: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  expiresAt: string | null;
  githubUrl: string | null;
  files: ReviewFileViewModel[];
  originalContentAvailable: boolean;
  evidence: ReviewEvidenceItem[];
  evaluation: ReviewDisplayEvaluation;
  raw: ReviewSummary;
}

export interface ReviewFileViewModel {
  path: string;
  action: string | null;
  originalContent: string | null;
  proposedContent: string | null;
  originalContentAvailable: boolean;
}

export const REVIEW_LIVE_EVENTS = ["workflow:changed", "review:completed"] as const;

const EMPTY_EVALUATION: ReviewDisplayEvaluation = {
  overall_score: null,
  dimensions: [],
  reasons: [],
  count: null,
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function text(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function score(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const normalized = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, normalized));
}

function normalizeFile(value: unknown): ReviewFileViewModel | null {
  const item = record(value);
  const path = text(item.path, item.name);
  if (!path) return null;
  const original = typeof item.original_content === "string"
    ? item.original_content
    : null;
  const proposed = typeof item.proposed_content === "string"
    ? item.proposed_content
    : typeof item.content === "string"
      ? item.content
      : null;
  const available = typeof item.original_content_available === "boolean"
    ? item.original_content_available
    : original !== null;
  return {
    path,
    action: text(item.action),
    originalContent: original,
    proposedContent: proposed,
    originalContentAvailable: available,
  };
}

function normalizeFiles(display: ReviewDisplay | null, document: Record<string, unknown>): ReviewFileViewModel[] {
  const source = display?.files ?? document.files;
  if (Array.isArray(source)) {
    return source.map(normalizeFile).filter((item): item is ReviewFileViewModel => item !== null);
  }
  const content = typeof document.content === "string" ? document.content : document.body;
  if (typeof content === "string") {
    return [{
      path: text(document.path, document.title) ?? "Generated document",
      action: "create",
      originalContent: null,
      proposedContent: content,
      originalContentAvailable: false,
    }];
  }
  return [];
}

function normalizeEvaluation(display: ReviewDisplay | null, detail: Record<string, unknown>): ReviewDisplayEvaluation {
  const value = record(display?.evaluation ?? detail.evaluation);
  const dimensions = Array.isArray(value.dimensions)
    ? value.dimensions.filter((item): item is Record<string, unknown> => item !== null && typeof item === "object")
    : [];
  const reasons = Array.isArray(value.reasons)
    ? value.reasons.filter((item): item is string => typeof item === "string")
    : [];
  const count = typeof value.count === "number" && Number.isInteger(value.count)
    ? value.count
    : null;
  return {
    overall_score: score(value.overall_score ?? value.score),
    dimensions,
    reasons,
    count,
  };
}

function displayStatus(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    expired: "Expired",
    needs_changes: "Needs changes",
    pending_review: "Pending",
  };
  return labels[status.toLowerCase()] ?? status;
}

export function toReviewViewModel(review: ReviewSummary): ReviewViewModel {
  const display = review.display ?? null;
  const detail = record(review.detail);
  const document = record(detail.document);
  const pr = record(review.pr);
  const files = normalizeFiles(display, document);
  const evaluation = normalizeEvaluation(display, detail);
  const repository = text(
    display?.repository,
    document.repository,
    pr.owner && pr.repo ? `${String(pr.owner)}/${String(pr.repo)}` : null,
  );
  const title = text(
    display?.title,
    document.title,
    pr.title,
    document.summary,
    detail.summary,
    review.action_description,
    files[0]?.path,
  ) ?? "Untitled review";
  const description = text(
    display?.description,
    document.description,
    document.summary,
    detail.summary,
    review.action_description,
  ) ?? "No description available.";
  const evidence = display?.evidence ?? (Array.isArray(detail.evidence)
    ? detail.evidence.filter((item): item is ReviewEvidenceItem => item !== null && typeof item === "object")
    : []);
  const githubUrl = text(
    display?.github_url,
    pr.url,
    pr.html_url,
    pr.github_url,
    pr.owner && pr.repo && pr.issue_number
      ? `https://github.com/${pr.owner}/${pr.repo}/pull/${pr.issue_number}`
      : null,
  );
  const rawStatus = String(review.status ?? "").toLowerCase();
  return {
    id: review.id,
    runId: review.run_id,
    title,
    reference: text(display?.reference, pr.trigger_label, document.reference),
    description,
    repository,
    path: files[0]?.path ?? null,
    type: text(display?.change_type, document.change_type, files[0]?.action),
    risk: text(display?.risk),
    score: evaluation.overall_score,
    evaluationCount: evaluation.count,
    status: displayStatus(rawStatus),
    rawStatus,
    decision: review.decision,
    decisionComment: review.decision_comment,
    createdAt: review.created_at,
    updatedAt: display?.updated_at ?? review.decided_at ?? review.created_at,
    expiresAt: review.expires_at,
    githubUrl,
    files,
    originalContentAvailable: files.some((file) => file.originalContentAvailable),
    evidence,
    evaluation,
    raw: review,
  };
}

export { EMPTY_EVALUATION };
