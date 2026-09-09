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
  assert.deepEqual(buildReviewDecision("run-1", true, "  ship it  "), {
    runId: "run-1",
    approved: true,
    comment: "ship it",
  });
  assert.deepEqual(buildReviewDecision("run-1", false, "   "), {
    runId: "run-1",
    approved: false,
    comment: undefined,
  });
});
