import assert from "node:assert/strict";
import test from "node:test";
import { buildReviewDecision, canDecideReview } from "../lib/review-actions.ts";

test("only pending reviews can be decided", () => {
  assert.equal(canDecideReview("pending"), true);
  assert.equal(canDecideReview("approved"), false);
  assert.equal(canDecideReview("rejected"), false);
  assert.equal(canDecideReview("expired"), false);
});

test("builds approve and reject decisions with trimmed optional comments", () => {
  assert.deepEqual(buildReviewDecision("run-1", "approve", "  ship it  "), {
    runId: "run-1",
    decision: "approve",
    comment: "ship it",
  });
  assert.deepEqual(buildReviewDecision("run-1", "reject", "   "), {
    runId: "run-1",
    decision: "reject",
    comment: undefined,
  });
});

test("builds a request-changes decision with a required trimmed comment", () => {
  assert.deepEqual(buildReviewDecision("run-1", "request_changes", "  add rollback steps  "), {
    runId: "run-1",
    decision: "request_changes",
    comment: "add rollback steps",
  });
});
