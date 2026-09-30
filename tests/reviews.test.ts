import assert from "node:assert/strict";
import test from "node:test";
import { normalizePageResults, pageRingProgress, pageScoreLabel, selectEvaluatedPage } from "../lib/page-evaluations.ts";
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

test("carries documentation page_results onto the review view model", () => {
  // Mirrors a real `page_results` payload from GET /reviews/{id}: the page
  // workflow writes no legacy `tool_args.evaluation`, so `page_results` is the
  // only source of per-page scores.
  const view = toReviewViewModel({
    ...enrichedReview,
    display: {
      ...enrichedReview.display!,
      evaluation: { overall_score: null, dimensions: [], reasons: [], count: 0 },
      page_results: [
        {
          page_id: "docs/api.md",
          path: "docs/api.md",
          status: "passed",
          version: 1,
          attempts: 1,
          score: 1,
          failed_metrics: [],
          feedback: [],
          escalation_reason: null,
        },
        {
          page_id: "docs/oauth.md",
          path: "docs/oauth.md",
          status: "awaiting_human_review",
          version: 2,
          attempts: 3,
          score: 0.4,
          failed_metrics: ["quality_score"],
          feedback: ["Add a usage example."],
          escalation_reason: "Exhausted automated attempts",
        },
      ],
    },
  });

  assert.equal(view.score, null);
  assert.equal(view.pages.length, 2);
  assert.equal(view.pages[0].path, "docs/api.md");
  assert.equal(view.pages[0].score, 100);
  assert.equal(view.pages[1].score, 40);
  assert.equal(view.pages[1].failedMetrics[0], "quality_score");
  // Rows arrive in path order, so with nothing selected the card must still
  // open on the page that needs attention rather than the first passed row.
  assert.equal(selectEvaluatedPage(view.pages, null)?.path, "docs/oauth.md");
});

test("the AI Evaluation column falls back to the page average when there is no legacy score", () => {
  // A real documentation review has `detail.evaluation = {}`, so `score` is
  // null and the column has nothing to show unless it reads `page_results`.
  const view = toReviewViewModel({
    ...enrichedReview,
    display: {
      ...enrichedReview.display!,
      evaluation: { overall_score: null, dimensions: [], reasons: [], count: null },
      page_results: [
        { page_id: "docs/a.md", path: "docs/a.md", status: "passed", version: 1, attempts: 1, score: 1 },
        { page_id: "docs/b.md", path: "docs/b.md", status: "passed", version: 1, attempts: 1, score: 1 },
        { page_id: "docs/c.md", path: "docs/c.md", status: "passed", version: 1, attempts: 1, score: 1 },
        { page_id: "docs/d.md", path: "docs/d.md", status: "passed", version: 1, attempts: 1, score: 1 },
        { page_id: "docs/e.md", path: "docs/e.md", status: "passed", version: 1, attempts: 1, score: 1 },
        { page_id: "docs/f.md", path: "docs/f.md", status: "passed", version: 1, attempts: 1, score: 1 },
        { page_id: "docs/g.md", path: "docs/g.md", status: "passed", version: 1, attempts: 1, score: 0.7 },
        // Never evaluated: must not drag the average down.
        { page_id: "docs/h.md", path: "docs/h.md", status: "pending", version: 0, attempts: 0, score: null },
      ].map((page) => ({ failed_metrics: [], feedback: [], escalation_reason: null, ...page })),
    },
  });

  assert.equal(view.score, null, "the legacy field really is absent");
  assert.equal(view.pageScore, 96, "the column must fall back to the page average");
  assert.deepEqual(view.pageScoreCoverage, { scored: 7, total: 8 });
  assert.equal(pageScoreLabel(view.pageScore), "96%");
});

test("the column keeps the legacy score when the review has one", () => {
  // A review can carry BOTH a legacy overall score and page_results. They can
  // disagree, so the precedence has to be pinned explicitly - a fixture without
  // page_results would pass no matter which source won.
  const view = toReviewViewModel({
    ...enrichedReview,
    display: {
      ...enrichedReview.display!,
      evaluation: { overall_score: 94, dimensions: [], reasons: [], count: 1 },
      page_results: [
        { page_id: "docs/a.md", path: "docs/a.md", status: "passed", version: 1, attempts: 1, score: 0.6, failed_metrics: [], feedback: [], escalation_reason: null },
        { page_id: "docs/b.md", path: "docs/b.md", status: "passed", version: 1, attempts: 1, score: 0.84, failed_metrics: [], feedback: [], escalation_reason: null },
      ],
    },
  });

  assert.equal(view.score, 94);
  // The legacy score wins even though the page average is a different 72.
  assert.equal(view.pageScore, 94);
  assert.deepEqual(view.pageScoreCoverage, { scored: 2, total: 2 });
});

test("the column has no score source at all when the review carries neither", () => {
  const view = toReviewViewModel({
    ...enrichedReview,
    display: { ...enrichedReview.display!, evaluation: { overall_score: null, dimensions: [], reasons: [], count: null } },
  });

  assert.equal(view.score, null);
  assert.equal(view.pageScore, null);
  assert.deepEqual(view.pageScoreCoverage, { scored: 0, total: 0 });
});

test("the column shows nothing when neither source has a score", () => {
  const view = toReviewViewModel({
    ...enrichedReview,
    display: {
      ...enrichedReview.display!,
      evaluation: { overall_score: null, dimensions: [], reasons: [], count: null },
      page_results: [{ page_id: "docs/h.md", path: "docs/h.md", status: "pending", version: 0, attempts: 0, score: null, failed_metrics: [], feedback: [], escalation_reason: null }],
    },
  });

  assert.equal(view.pageScore, null, "must be null so the column renders an em dash, not 0%");
  assert.deepEqual(view.pageScoreCoverage, { scored: 0, total: 1 });
  assert.equal(pageScoreLabel(view.pageScore), "—");
});

test("the document file selector drives which score the ring shows", () => {
  // The document dropdown and the evaluation ring describe the same file, so
  // the ring fraction and label must both follow the selected path.
  const options = normalizePageResults([
    { page_id: "docs/api.md", path: "docs/api.md", status: "passed", version: 1, attempts: 1, score: 0.95 },
    { page_id: "docs/oauth.md", path: "docs/oauth.md", status: "awaiting_human_review", version: 2, attempts: 3, score: 0.4 },
  ]);

  const chosen = selectEvaluatedPage(options, "docs/api.md");
  assert.equal(chosen?.path, "docs/api.md");
  assert.equal(pageScoreLabel(chosen!.score), "95%");
  assert.equal(pageRingProgress(chosen!), 0.95);

  const defaulted = selectEvaluatedPage(options, null);
  assert.equal(defaulted?.path, "docs/oauth.md");
  assert.equal(pageScoreLabel(defaulted!.score), "40%");
  assert.equal(pageRingProgress(defaulted!), 0.4);
});

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
