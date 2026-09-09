import assert from "node:assert/strict";
import test from "node:test";
import { REVIEW_LIVE_EVENTS } from "../lib/reviews.ts";

test("review data refreshes on workflow changes and review completion", () => {
  assert.deepEqual(REVIEW_LIVE_EVENTS, ["workflow:changed", "review:completed"]);
});
