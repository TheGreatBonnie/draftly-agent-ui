import assert from "node:assert/strict";
import test from "node:test";
import { normalizePageResults, pageDetailRows, pageStatusLabel, pageStatusTone } from "../lib/page-evaluations.ts";

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