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

test("formats cursor page intervals without hardcoded totals", () => {
  assert.equal(reviewPageInterval(0, 5, 12), "Showing 1 to 5 of 12 reviews");
  assert.equal(reviewPageInterval(10, 5, 12), "Showing 11 to 12 of 12 reviews");
  assert.equal(reviewPageInterval(0, 0, 0), "No reviews");
});
