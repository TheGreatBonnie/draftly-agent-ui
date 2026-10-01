import test from "node:test";
import assert from "node:assert/strict";
import type { ReviewListCounts, ReviewListResponse } from "../api/observability.ts";
import { pendingReviewsBadge } from "../lib/nav-badges.ts";

function counts(overrides: Partial<ReviewListCounts> = {}): ReviewListCounts {
  return {
    pending: 0,
    urgent: 0,
    approved: 0,
    needs_changes: 0,
    rejected: 0,
    ...overrides,
  };
}

test("shows the pending count the reviews API reports", () => {
  const response = { counts: counts({ pending: 12 }) } as ReviewListResponse;
  assert.deepEqual(pendingReviewsBadge(response), { count: 12, label: "12 reviews pending" });
});

test("hides the badge when nothing is pending rather than showing a zero", () => {
  const response = { counts: counts({ pending: 0 }) } as ReviewListResponse;
  assert.equal(pendingReviewsBadge(response), null);
});

test("hides the badge while the count is still unknown", () => {
  assert.equal(pendingReviewsBadge(null), null);
  assert.equal(pendingReviewsBadge({} as ReviewListResponse), null);
  assert.equal(pendingReviewsBadge({ counts: undefined } as ReviewListResponse), null);
});

test("counts urgent reviews within pending instead of double counting them", () => {
  const response = { counts: counts({ pending: 4, urgent: 3 }) } as ReviewListResponse;
  assert.deepEqual(pendingReviewsBadge(response), { count: 4, label: "4 reviews pending" });
});

test("ignores a negative or non-finite count from a malformed response", () => {
  assert.equal(pendingReviewsBadge({ counts: counts({ pending: -3 }) } as ReviewListResponse), null);
  assert.equal(
    pendingReviewsBadge({ counts: counts({ pending: Number.NaN }) } as ReviewListResponse),
    null,
  );
});