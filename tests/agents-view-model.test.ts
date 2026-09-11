import assert from "node:assert/strict";
import test from "node:test";
import { filterAgents, formatSuccessRate } from "../lib/agent-view-model.ts";
import type { AgentSummary } from "../api/types.ts";

const agent = (overrides: Partial<AgentSummary> = {}): AgentSummary => ({
  id: "writer_agent", role: "writer_agent", name: "Documentation Writer",
  description: "Writes API docs", surface: "documentation", tools: ["write_file"],
  availability: "enabled", last_run_status: "completed", runs_7d: 2,
  success_rate_7d: 1, last_run_at: null, latest_run_id: "run-1", legacy_steps: 0,
  ...overrides,
});

test("filters agents by text, surface, and runtime status", () => {
  const rows = [agent(), agent({ id: "support", name: "Support Agent", description: "Answers questions", surface: "support", last_run_status: "idle" })];
  assert.equal(filterAgents(rows, { query: "api", surface: "all", status: "all" }).length, 1);
  assert.equal(filterAgents(rows, { query: "", surface: "support", status: "all" })[0]?.id, "support");
  assert.equal(filterAgents(rows, { query: "", surface: "all", status: "idle" })[0]?.id, "support");
});

test("does not fabricate unavailable metrics or run dates", () => {
  assert.equal(formatSuccessRate(null), "—");
});
