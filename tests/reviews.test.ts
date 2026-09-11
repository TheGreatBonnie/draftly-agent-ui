import assert from "node:assert/strict";
import test from "node:test";
import { toReviewViewModel } from "../lib/reviews.ts";
import type { ReviewSummary } from "../api/observability.ts";

const enrichedReview: ReviewSummary = {
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
  detail: {
    summary: "Updated widgets guide",
  },
  pr: {
    title: "Update widgets",
    trigger_label: "PR #42",
    owner: "acme",
    repo: "api",
    issue_number: 42,
  },
  display: {
    title: "Updated widgets guide",
    reference: "PR #42",
    description: "Updated widgets guide",
    repository: "acme/api",
    files: [
      {
        path: "docs/widgets.md",
        action: "update",
        original_content: "# Old widgets",
        proposed_content: "# Widgets",
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
    risk: "medium",
    evaluation: {
      overall_score: 0.94,
      dimensions: [{ name: "grounding", value: 0.96 }],
      reasons: ["Grounded in 3/3 sources"],
      count: 1,
    },
    evidence: [{ id: "docs/widgets.md", topic: "widgets" }],
    github_url: "https://github.com/acme/api/pull/42",
    updated_at: "2026-09-09T10:00:00Z",
  },
};

test("normalizes enriched review fields and preserves all files", () => {
  const view = toReviewViewModel(enrichedReview);

  assert.equal(view.title, "Updated widgets guide");
  assert.equal(view.reference, "PR #42");
  assert.equal(view.score, 94);
  assert.equal(view.files.length, 2);
  assert.equal(view.files[0].proposedContent, "# Widgets");
  assert.equal(view.files[0].originalContentAvailable, true);
  assert.equal(view.files[1].originalContentAvailable, false);
  assert.equal(view.status, "Pending");
  assert.equal(view.githubUrl, "https://github.com/acme/api/pull/42");
});

test("normalizes whole-number scores and preserves unavailable values", () => {
  const view = toReviewViewModel({
    ...enrichedReview,
    pr: null,
    display: {
      ...enrichedReview.display!,
      evaluation: { overall_score: 94, dimensions: [], reasons: [], count: null },
      risk: null,
      github_url: null,
    },
  });

  assert.equal(view.score, 94);
  assert.equal(view.risk, null);
  assert.equal(view.evaluationCount, null);
  assert.equal(view.githubUrl, null);
});

test("falls back to legacy raw review fields without inventing values", () => {
  const view = toReviewViewModel({
    ...enrichedReview,
    pr: null,
    display: null,
    detail: {
      summary: "Legacy review",
      document: {
        repository: "acme/api",
        files: [{ path: "docs/legacy.md", content: "# Legacy", action: "update" }],
      },
      evaluation: { score: 0.7 },
    },
    action_description: "Legacy review",
    status: "approved",
  });

  assert.equal(view.title, "Legacy review");
  assert.equal(view.repository, "acme/api");
  assert.equal(view.files[0].path, "docs/legacy.md");
  assert.equal(view.files[0].proposedContent, "# Legacy");
  assert.equal(view.score, 70);
  assert.equal(view.risk, null);
  assert.equal(view.status, "Approved");
});
