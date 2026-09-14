import test from "node:test";
import assert from "node:assert/strict";
import * as evaluations from "../lib/evaluations.ts";

const { evaluationStatusLabel, evaluationScore } = evaluations;

test("evaluation view model treats missing scores as unavailable", () => {
  assert.equal(evaluationScore(null), "—");
  assert.equal(evaluationScore(91.25), "91.3%");
  assert.equal(evaluationStatusLabel("running"), "Running");
  assert.equal(evaluationStatusLabel("unknown"), "Unknown");
});

test("evaluation trend builds every UTC day without inventing missing scores", () => {
  const buildTrend = (evaluations as unknown as {
    buildEvaluationTrendDays?: (
      trend: Array<{ date: string; average_score: number; run_count: number }>,
      days: number,
      endDate: Date,
    ) => Array<{ date: string; average_score: number | null; run_count: number }>;
  }).buildEvaluationTrendDays;

  assert.equal(typeof buildTrend, "function");
  assert.deepEqual(
    buildTrend?.(
      [
        { date: "2026-09-01", average_score: 55, run_count: 2 },
        { date: "2026-09-03", average_score: 75, run_count: 1 },
      ],
      3,
      new Date("2026-09-03T18:00:00Z"),
    ),
    [
      { date: "2026-09-01", average_score: 55, run_count: 2 },
      { date: "2026-09-02", average_score: null, run_count: 0 },
      { date: "2026-09-03", average_score: 75, run_count: 1 },
    ],
  );
});

test("evaluation trend preserves missing dates as separate line segments", () => {
  const splitSegments = (evaluations as unknown as {
    splitEvaluationTrendSegments?: <T extends { average_score: number | null }>(
      values: T[],
    ) => T[][];
  }).splitEvaluationTrendSegments;
  const values = [
    { date: "2026-09-01", average_score: 55 },
    { date: "2026-09-02", average_score: null },
    { date: "2026-09-03", average_score: 75 },
    { date: "2026-09-04", average_score: 80 },
  ];

  assert.equal(typeof splitSegments, "function");
  assert.deepEqual(
    splitSegments?.(values).map((segment) => segment.map((point) => point.date)),
    [["2026-09-01"], ["2026-09-03", "2026-09-04"]],
  );
});

test("evaluation trend honors the full selected window", () => {
  const buildTrend = (evaluations as unknown as {
    buildEvaluationTrendDays?: (
      trend: Array<{ date: string; average_score: number; run_count: number }>,
      days: number,
      endDate: Date,
    ) => unknown[];
  }).buildEvaluationTrendDays;

  assert.equal(typeof buildTrend, "function");
  assert.equal(buildTrend?.([], 30, new Date("2026-09-14T00:00:00Z")).length, 30);
});
