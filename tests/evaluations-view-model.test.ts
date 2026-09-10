import test from "node:test";
import assert from "node:assert/strict";
import { evaluationStatusLabel, evaluationScore } from "../lib/evaluations.ts";

test("evaluation view model treats missing scores as unavailable", () => {
  assert.equal(evaluationScore(null), "—");
  assert.equal(evaluationScore(91.25), "91.3%");
  assert.equal(evaluationStatusLabel("running"), "Running");
  assert.equal(evaluationStatusLabel("unknown"), "Unknown");
});
