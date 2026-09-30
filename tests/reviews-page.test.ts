import assert from "node:assert/strict";
import test from "node:test";
import { filterReviewItems, reviewPageInterval } from "../lib/reviews-page.ts";
import type { ReviewViewModel } from "../lib/reviews.ts";

function review(overrides: Partial<ReviewViewModel> = {}): ReviewViewModel {
  return {
    id: "review-1",
    runId: "run-1",
    title: "Widgets guide",
    reference: "PR #42",
    description: "Update widgets",
    repository: "acme/api",
    path: "docs/widgets.md",
    type: "update",
    risk: "medium",
    score: 94,
    pageScore: 94,
    pageScoreCoverage: { scored: 0, total: 0 },
    evaluationCount: 1,
    status: "Pending",
    rawStatus: "pending",
    decision: null,
    decisionComment: null,
    createdAt: "2026-09-09T10:00:00Z",
    updatedAt: "2026-09-09T10:00:00Z",
    expiresAt: null,
    githubUrl: null,
    files: [],
    originalContentAvailable: false,
    evidence: [],
    evaluation: { overall_score: 94, dimensions: [], reasons: [], count: 1 },
    pages: [],
    raw: {} as ReviewViewModel["raw"],
    ...overrides,
  };
}

test("filters review rows by search, repository, type, risk, and score", () => {
  const rows = [
    review(),
    review({
      id: "review-2",
      title: "Auth guide",
      repository: "acme/auth",
      type: "create",
      risk: "high",
      score: 72,
      pageScore: 72,
    }),
  ];

  assert.deepEqual(
    filterReviewItems(rows, { query: "auth", repository: "acme/auth" }).map((r) => r.id),
    ["review-2"],
  );
  assert.deepEqual(
    filterReviewItems(rows, { type: "create", risk: "high", score: "below80" }).map((r) => r.id),
    ["review-2"],
  );
});

test("the score filter works for reviews scored from pages, not just legacy scores", () => {
  // Documentation reviews have `score: null` and carry their number in
  // `pageScore`. Filtering on `score` alone matched nothing for every real
  // review, so the "Below 80%" dropdown silently returned an empty list.
  const rows = [
    // A page-scored review: legacy score absent, page average 72.
    review({ id: "page-scored-low", score: null, pageScore: 72 }),
    review({ id: "page-scored-high", score: null, pageScore: 95 }),
    review({ id: "page-scored-mid", score: null, pageScore: 85 }),
    // Unscored in both places: must not match any score bucket.
    review({ id: "unscored", score: null, pageScore: null }),
  ];

  assert.deepEqual(
    filterReviewItems(rows, { score: "below80" }).map((r) => r.id),
    ["page-scored-low"],
  );
  assert.deepEqual(
    filterReviewItems(rows, { score: "80to89" }).map((r) => r.id),
    ["page-scored-mid"],
  );
  assert.deepEqual(
    filterReviewItems(rows, { score: "90plus" }).map((r) => r.id),
    ["page-scored-high"],
  );
});

test("formats cursor page intervals without hardcoded totals", () => {
  assert.equal(reviewPageInterval(0, 5, 12), "Showing 1 to 5 of 12 reviews");
  assert.equal(reviewPageInterval(10, 5, 12), "Showing 11 to 12 of 12 reviews");
  assert.equal(reviewPageInterval(0, 0, 0), "No reviews");
});
