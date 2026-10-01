import test from "node:test";
import assert from "node:assert/strict";
import { metricRows, pageQualityCards } from "../lib/page-quality-view.ts";
import type { PageQualitySummary } from "../api/page-quality.ts";

const summary: PageQualitySummary = {
  average_score: 62.4,
  total_runs: 2,
  scored_pages: 7,
  total_pages: 9,
  passed: 5,
  needs_revision: 1,
  awaiting_human: 1,
  by_metric: [{ metric: "detail", average_score: 100, sample_count: 7 }],
  trend: [],
};

test("cards report page coverage, not case counts", () => {
  const cards = pageQualityCards(summary);
  const labels = cards.map((c) => c.label);
  assert.ok(labels.includes("Pages scored"));
  assert.ok(!labels.includes("Test cases"));
  const scored = cards.find((c) => c.label === "Pages scored");
  assert.equal(scored?.value, "7 of 9");
});

test("no scored pages yields an em dash rather than zero", () => {
  const cards = pageQualityCards({
    ...summary,
    average_score: null,
    scored_pages: 0,
    total_pages: 4,
  });
  const avg = cards.find((c) => c.label === "Average score");
  assert.equal(avg?.value, "—");
});

test("needs-work card sums revision and human-review pages", () => {
  const cards = pageQualityCards(summary);
  const needsWork = cards.find((c) => c.label === "Needs work");
  assert.equal(needsWork?.value, "2");
});

test("metric rows round to whole percents", () => {
  const rows = metricRows(summary);
  assert.equal(rows[0].label, "detail");
  assert.equal(rows[0].value, "100%");
});

import { pageRows } from "../lib/page-quality-view.ts";

test("page rows label unscored pages as unknown, not zero", () => {
  const rows = pageRows([
    {
      page_id: "p1",
      path: "docs/a.md",
      status: "awaiting_human_review",
      score: null,
      run_id: "r1",
      updated_at: null,
    },
  ]);
  assert.equal(rows[0].score, "—");
  assert.equal(rows[0].status, "Awaiting review");
});
