import assert from "node:assert/strict";
import test from "node:test";
import { averagePageScore, findPageEvaluation, normalizePageResults, pageDetailRows, pageRingProgress, pageScoreCoverage, pageStatusLabel, pageStatusTone, pickDefaultPageIndex, selectEvaluatedPage } from "../lib/page-evaluations.ts";

const AWAITING_PAGE = {
  page_id: "docs/oauth.md",
  path: "docs/oauth.md",
  status: "awaiting_human_review",
  version: 2,
  attempts: 3,
  score: 0.4,
  failed_metrics: ["quality_score"],
  feedback: ["Add a usage example.", "Cite the refresh-token flow."],
  escalation_reason: "Exhausted automated attempts",
};

test("normalizes missing, unknown, and non-array page_results to empty list", () => {
  assert.deepEqual(normalizePageResults(undefined), []);
  assert.deepEqual(normalizePageResults(null), []);
  assert.deepEqual(normalizePageResults({}), []);
  assert.deepEqual(normalizePageResults("nope"), []);
  assert.deepEqual(normalizePageResults(12), []);
});

test("normalizes a passed page result into a page evaluation summary", () => {
  const [page] = normalizePageResults([
    {
      page_id: "docs/oauth.md",
      path: "docs/oauth.md",
      status: "passed",
      version: 1,
      attempts: 1,
      score: 0.93,
      failed_metrics: [],
      feedback: [],
      escalation_reason: null,
    },
  ]);

  assert.equal(page.pageId, "docs/oauth.md");
  assert.equal(page.path, "docs/oauth.md");
  assert.equal(page.status, "passed");
  assert.equal(page.version, 1);
  assert.equal(page.attempts, 1);
  assert.equal(page.score, 93);
  assert.deepEqual(page.failedMetrics, []);
  assert.deepEqual(page.feedback, []);
  assert.equal(page.escalationReason, null);
  assert.equal(pageStatusLabel(page.status), "Passed");
  assert.equal(pageStatusTone(page.status), "green");
});

test("renders awaiting-review pages with failed metrics and feedback", () => {
  const [page] = normalizePageResults([AWAITING_PAGE]);
  const rows = pageDetailRows(page);
  const rendered = [
    page.path,
    pageStatusLabel(page.status),
    ...rows.map((row) => `${row.label} ${row.value}`),
  ].join("\n");

  assert.match(rendered, /docs\/oauth\.md/);
  assert.match(rendered, /Awaiting human review/);
  assert.match(rendered, /Attempt 3/);
  assert.match(rendered, /quality_score/);
  assert.match(rendered, /Version 2/);
  assert.match(rendered, /40%/);
  assert.match(rendered, /Add a usage example/);
  assert.match(rendered, /Exhausted automated attempts/);
  assert.equal(pageStatusTone(page.status), "amber");
});

test("labels every known page status in plain text independent of color", () => {
  const expected: Record<string, string> = {
    pending: "Pending",
    writing: "Writing",
    evaluating: "Evaluating",
    revising: "Revising",
    passed: "Passed",
    awaiting_human_review: "Awaiting human review",
    failed: "Failed",
  };

  for (const [status, label] of Object.entries(expected)) {
    assert.equal(pageStatusLabel(status), label);
    assert.notEqual(pageStatusLabel(status).toLowerCase(), pageStatusTone(status));
  }
});

test("keeps unknown statuses readable and missing paths filtered", () => {
  const [page] = normalizePageResults([
    { page_id: "docs/next.md", path: "docs/next.md", status: "unknown_status" },
    { page_id: null, path: null, status: "failed" },
  ]);

  assert.equal(page.pageId, "docs/next.md");
  assert.equal(String(page.status), "unknown_status");
  assert.equal(pageStatusLabel(String(page.status)), "Unknown Status");
  assert.equal(page.version, 0);
  assert.equal(page.attempts, 0);
  assert.equal(page.score, null);
});

function page(overrides: Record<string, unknown> = {}) {
  return {
    page_id: "docs/a.md",
    path: "docs/a.md",
    status: "passed",
    version: 1,
    attempts: 1,
    score: 0.9,
    failed_metrics: [],
    feedback: [],
    escalation_reason: null,
    ...overrides,
  };
}

test("averages the final score across scored pages", () => {
  // Scores arrive as 0-1 fractions and normalize to 0-100.
  const pages = normalizePageResults([
    page({ path: "docs/a.md", score: 1 }),
    page({ path: "docs/b.md", score: 1 }),
    page({ path: "docs/c.md", score: 1 }),
    page({ path: "docs/d.md", score: 1 }),
    page({ path: "docs/e.md", score: 1 }),
    page({ path: "docs/f.md", score: 1 }),
    page({ path: "docs/g.md", score: 0.7 }),
  ]);

  assert.equal(averagePageScore(pages), 96);
});

test("skips unscored pages instead of counting them as zero", () => {
  // A page whose latest artifact has no evaluation yet is unknown, not zero.
  // Treating it as 0 would understate the review's quality.
  const pages = normalizePageResults([
    page({ path: "docs/a.md", score: 1 }),
    page({ path: "docs/b.md", score: 0.4 }),
    page({ path: "docs/c.md", score: null }),
    page({ path: "docs/d.md", score: null }),
  ]);

  assert.equal(averagePageScore(pages), 70);
});

test("has no average when no page has been scored", () => {
  assert.equal(averagePageScore([]), null);
  assert.equal(averagePageScore(normalizePageResults([page({ score: null })])), null);
  assert.equal(
    averagePageScore(normalizePageResults([page({ score: null }), page({ path: "docs/b.md", score: null })])),
    null,
  );
});

test("averages one scored page exactly, without rounding drift", () => {
  assert.equal(averagePageScore(normalizePageResults([page({ score: 0.33 })])), 33);
  assert.equal(averagePageScore(normalizePageResults([page({ score: 0.67 })])), 67);
});

test("reports how many pages carry a score, for the column sub-label", () => {
  const pages = normalizePageResults([
    page({ path: "docs/a.md", score: 1 }),
    page({ path: "docs/b.md", score: null }),
  ]);

  assert.deepEqual(pageScoreCoverage(pages), { scored: 1, total: 2 });
  assert.deepEqual(pageScoreCoverage([]), { scored: 0, total: 0 });
});

test("finds the page evaluation matching the selected document file", () => {
  // The document file list and the page evaluation list are built from
  // different queries and arrive in different order, so match on path.
  const pages = normalizePageResults([
    page({ page_id: "docs/reference/api.md", path: "docs/reference/api.md", score: 1 }),
    page({ page_id: "docs/how-to/oauth.md", path: "docs/how-to/oauth.md", score: 0.4 }),
  ]);

  assert.equal(findPageEvaluation(pages, "docs/how-to/oauth.md")?.score, 40);
  assert.equal(findPageEvaluation(pages, "docs/reference/api.md")?.score, 100);
});

test("matches the selected file path tolerantly but not loosely", () => {
  const pages = normalizePageResults([page({ path: "docs/reference/api.md", score: 0.9 })]);

  assert.equal(findPageEvaluation(pages, "./docs/reference/api.md")?.score, 90);
  assert.equal(findPageEvaluation(pages, "/docs/reference/api.md")?.score, 90);
  assert.equal(findPageEvaluation(pages, "  docs/reference/api.md  ")?.score, 90);
  // Must not match a different file that merely shares a suffix.
  assert.equal(findPageEvaluation(pages, "docs/api.md"), null);
  assert.equal(findPageEvaluation(pages, "reference/api.md"), null);
  assert.equal(findPageEvaluation(pages, null), null);
  assert.equal(findPageEvaluation([], "docs/reference/api.md"), null);
});

test("selects the evaluated page for the document file in view", () => {
  const pages = normalizePageResults([
    page({ path: "docs/api.md", status: "passed", score: 1 }),
    page({ path: "docs/oauth.md", status: "awaiting_human_review", score: 0.4 }),
  ]);

  // The selected file always wins.
  assert.equal(selectEvaluatedPage(pages, "docs/api.md")?.path, "docs/api.md");
  // Nothing selected yet: open on the page needing attention.
  assert.equal(selectEvaluatedPage(pages, null)?.path, "docs/oauth.md");
  // A selected file with no evaluation must NOT borrow another file's score.
  assert.equal(selectEvaluatedPage(pages, "docs/changelog.md"), null);
  assert.equal(selectEvaluatedPage([], "docs/api.md"), null);
});

test("ring progress is the normalized score as a clamped 0-1 fraction", () => {
  assert.equal(pageRingProgress({ score: 93 } as never), 0.93);
  assert.equal(pageRingProgress({ score: 40 } as never), 0.4);
  assert.equal(pageRingProgress({ score: 100 } as never), 1);
});

test("ring progress is zero for unevaluated pages and clamps out-of-range scores", () => {
  assert.equal(pageRingProgress({ score: null } as never), 0);
  assert.equal(pageRingProgress({ score: 140 } as never), 1);
  assert.equal(pageRingProgress({ score: -5 } as never), 0);
});

test("default page is the first page needing attention, ahead of passed pages", () => {
  const pages = normalizePageResults([
    page({ page_id: "docs/ok.md", path: "docs/ok.md", status: "passed" }),
    page({ page_id: "docs/bad.md", path: "docs/bad.md", status: "awaiting_human_review" }),
    page({ page_id: "docs/also-ok.md", path: "docs/also-ok.md", status: "passed" }),
  ]);

  assert.equal(pages[pickDefaultPageIndex(pages)].path, "docs/bad.md");
});

test("default page prefers failed over escalated over revising over passed", () => {
  const all = normalizePageResults([
    page({ page_id: "d/passed.md", path: "d/passed.md", status: "passed" }),
    page({ page_id: "d/revising.md", path: "d/revising.md", status: "revising" }),
    page({ page_id: "d/escalated.md", path: "d/escalated.md", status: "awaiting_human_review" }),
    page({ page_id: "d/failed.md", path: "d/failed.md", status: "failed" }),
  ]);

  assert.equal(all[pickDefaultPageIndex(all)].path, "d/failed.md");
  const noFailed = all.filter((item) => item.status !== "failed");
  assert.equal(noFailed[pickDefaultPageIndex(noFailed)].path, "d/escalated.md");
  const onlyRevising = all.filter((item) => item.status === "revising" || item.status === "passed");
  assert.equal(onlyRevising[pickDefaultPageIndex(onlyRevising)].path, "d/revising.md");
});

test("default page breaks ties on the most attempted page", () => {
  const pages = normalizePageResults([
    page({ page_id: "d/one.md", path: "d/one.md", status: "revising", attempts: 1 }),
    page({ page_id: "d/three.md", path: "d/three.md", status: "revising", attempts: 3 }),
    page({ page_id: "d/two.md", path: "d/two.md", status: "revising", attempts: 2 }),
  ]);

  assert.equal(pages[pickDefaultPageIndex(pages)].path, "d/three.md");
});

test("default page falls back to the first page when all passed or all are unknown", () => {
  const passed = normalizePageResults([
    page({ page_id: "d/a.md", path: "d/a.md", status: "passed" }),
    page({ page_id: "d/b.md", path: "d/b.md", status: "passed" }),
  ]);
  assert.equal(passed[pickDefaultPageIndex(passed)].path, "d/a.md");

  const unknown = normalizePageResults([
    page({ page_id: "d/a.md", path: "d/a.md", status: "mystery" }),
    page({ page_id: "d/b.md", path: "d/b.md", status: "mystery" }),
  ]);
  assert.equal(unknown[pickDefaultPageIndex(unknown)].path, "d/a.md");
});

test("default page index is zero for an empty page list", () => {
  assert.equal(pickDefaultPageIndex([]), 0);
});