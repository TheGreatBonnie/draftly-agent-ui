import assert from "node:assert/strict";
import test from "node:test";
import { reviewDetailFacts } from "../lib/review-detail.ts";
import { toReviewViewModel } from "../lib/reviews.ts";
import type { ReviewSummary } from "../api/observability.ts";

const review: ReviewSummary = {
  id: "review-1",
  org_id: "org-1",
  run_id: "run-1",
  workflow: "documentation",
  tool_name: "doc-review",
  tool_args: {},
  action_description: "Update widgets",
  status: "pending",
  decision: null,
  decision_comment: null,
  decided_at: null,
  created_at: "2026-09-09T10:00:00Z",
  expires_at: null,
  interrupt_id: "interrupt-1",
  detail: null,
  pr: null,
  display: {
    title: "Updated widgets guide",
    reference: "Issue #7",
    description: "Document the new widgets API",
    repository: "acme/api",
    files: [
      {
        path: "docs/widgets.md",
        action: "update",
        original_content: "# Old",
        proposed_content: "# New",
        original_content_available: true,
      },
      {
        path: "docs/faq.md",
        action: "create",
        original_content: null,
        proposed_content: "# FAQ",
        original_content_available: false,
      },
    ],
    change_type: "update",
    risk: "high",
    evaluation: {
      overall_score: 92,
      dimensions: [{ name: "grounding", value: 0.9 }],
      reasons: ["Uses source evidence"],
      count: 2,
    },
    evidence: [{ title: "API reference", detail: "widgets()", count: 2 }],
    github_url: "https://github.com/acme/api/pull/7",
    updated_at: "2026-09-09T10:00:00Z",
  },
};

test("extracts dynamic detail facts for all existing display fields", () => {
  const facts = reviewDetailFacts(toReviewViewModel(review));

  assert.deepEqual(facts.files.map((file) => file.path), ["docs/widgets.md", "docs/faq.md"]);
  assert.equal(facts.title, "Updated widgets guide");
  assert.equal(facts.repository, "acme/api");
  assert.equal(facts.score, 92);
  assert.equal(facts.evidenceCount, 1);
  assert.equal(facts.dimensionCount, 1);
  assert.equal(facts.githubUrl, "https://github.com/acme/api/pull/7");
  assert.equal(facts.createdAt, "2026-09-09T10:00:00Z");
});

test("keeps absent detail values nullable", () => {
  const view = toReviewViewModel({ ...review, display: null, detail: null, pr: null });
  const facts = reviewDetailFacts(view);

  assert.equal(facts.score, null);
  assert.equal(facts.githubUrl, null);
  assert.equal(facts.evidenceCount, 0);
  assert.equal(facts.dimensionCount, 0);
});
