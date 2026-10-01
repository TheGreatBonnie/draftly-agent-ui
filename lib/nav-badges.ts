import type { ReviewListResponse } from "../api/observability.ts";

export interface NavBadge {
  count: number;
  label: string;
}

/**
 * Derive the sidebar Reviews badge from the review queue counts.
 *
 * `counts.pending` is the authoritative pending total. `counts.urgent` is a
 * risk-flagged slice of the same queue, not an additional group, so adding
 * them would double count. Zero and unknown counts hide the badge: a visible
 * "0" teaches people to ignore it.
 */
export function pendingReviewsBadge(
  response: ReviewListResponse | null,
): NavBadge | null {
  const pending = response?.counts?.pending;
  if (typeof pending !== "number" || !Number.isFinite(pending) || pending <= 0) {
    return null;
  }
  return {
    count: pending,
    label: `${pending} ${pending === 1 ? "review" : "reviews"} pending`,
  };
}