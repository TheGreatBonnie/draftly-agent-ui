export function canDecideReview(status: string): boolean {
  return status.toLowerCase() === "pending";
}

export type ReviewDecisionKind = "approve" | "request_changes" | "reject";

export function buildReviewDecision(
  runId: string,
  decision: ReviewDecisionKind,
  comment: string,
): { runId: string; decision: ReviewDecisionKind; comment: string | undefined } {
  const trimmed = comment.trim();
  return { runId, decision, comment: trimmed || undefined };
}
