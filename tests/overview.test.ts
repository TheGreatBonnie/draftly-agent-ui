import test from "node:test";
import assert from "node:assert/strict";
import type { OverviewSnapshot } from "../api/overview.ts";
import { formatActivityDate, formatRelativeTime, formatScore, formatTrend, rangeToDays, statusTone } from "../lib/overview.ts";

test("maps dashboard chart ranges to backend day counts", () => {
  assert.equal(rangeToDays("Today"), 1);
  assert.equal(rangeToDays("Last 7 days"), 7);
  assert.equal(rangeToDays("Last 14 days"), 14);
  assert.equal(rangeToDays("Last 30 days"), 30);
});

test("formats nullable evaluation values without inventing data", () => {
  assert.equal(formatScore(92), "92%");
  assert.equal(formatScore(null), "—");
  assert.equal(formatTrend(4), "↑ 4%");
  assert.equal(formatTrend(-2.5), "↓ 2.5%");
  assert.equal(formatTrend(null), null);
});

test("maps evaluation scores to bounded progress-ring ratios", async () => {
  const module = await import("../lib/overview.ts");
  const scoreToProgress = (
    module as { scoreToProgress?: (value: number | null) => number }
  ).scoreToProgress;

  assert.equal(scoreToProgress?.(100), 1);
  assert.equal(scoreToProgress?.(75), 0.75);
  assert.equal(scoreToProgress?.(null), 0);
  assert.equal(scoreToProgress?.(-10), 0);
  assert.equal(scoreToProgress?.(120), 1);
});

test("formats activity dates and relative timestamps consistently", () => {
  assert.equal(formatActivityDate("2026-09-05"), "Sep 5");
  assert.equal(
    formatRelativeTime("2026-09-09T10:00:00Z", new Date("2026-09-09T12:30:00Z")),
    "2h ago",
  );
  assert.equal(formatRelativeTime(null, new Date("2026-09-09T12:30:00Z")), "—");
});

test("maps backend statuses to semantic card tones", () => {
  assert.equal(statusTone("running"), "blue");
  assert.equal(statusTone("completed"), "green");
  assert.equal(statusTone("queued"), "amber");
  assert.equal(statusTone("failed"), "rose");
  assert.equal(statusTone("unknown"), "violet");
});

test("keeps pending interventions distinct from review attention", () => {
  const attention: OverviewSnapshot["attention"] = {
    pending_reviews: 1,
    pending_interventions: 2,
    high_risk_reviews: 0,
    failed_evaluations: 0,
    integration_issues: 0,
    stale_documentation: 0,
  };
  assert.equal(attention.pending_reviews, 1);
  assert.equal(attention.pending_interventions, 2);
});
