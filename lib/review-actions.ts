export function canDecideReview(status: string): boolean {
  return status.toLowerCase() === "pending";
}

export function buildReviewDecision(
  runId: string,
  approved: boolean,
  comment: string,
): { runId: string; approved: boolean; comment: string | undefined } {
  const trimmed = comment.trim();
  return { runId, approved, comment: trimmed || undefined };
}
