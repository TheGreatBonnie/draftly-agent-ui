import test from "node:test";
import assert from "node:assert/strict";
import {
  filterWorkflows,
  formatDuration,
  formatRelativeTime,
  getWorkflowStages,
  statusTone,
} from "../lib/workflow-view-model.ts";

const base = {
  id: "def-1",
  org_id: "org-1",
  name: "PR Documentation",
  slug: "pr-documentation",
  description: "Docs from pull requests",
  workflow_key: "github_pr",
  status: "active" as const,
  version: 2,
  trigger_config: { event: "pull_request.opened" },
  condition_config: {},
  agent_config: {},
  repository_config: {},
  evaluation_config: {},
  review_config: {},
  delivery_config: {},
  created_by: "user-1",
  created_at: "2026-09-10T10:00:00Z",
  updated_at: "2026-09-10T10:00:00Z",
};

test("filters definitions by name, slug, and workflow key", () => {
  assert.equal(filterWorkflows([base], "pull")[0]?.id, "def-1");
  assert.equal(filterWorkflows([base], "release").length, 0);
  assert.equal(filterWorkflows([base], "pr-doc")[0]?.id, "def-1");
});

test("maps persisted stage states to ordered display stages", () => {
  const stages = getWorkflowStages({
    ...base,
    workflow_key: "github_pr",
    stage_states: { research: "completed", write: "running" },
  });
  assert.equal(stages.find((stage) => stage.key === "research")?.status, "completed");
  assert.equal(stages.find((stage) => stage.key === "write")?.status, "running");
});

test("formats durations and maps statuses to accessible tones", () => {
  assert.equal(formatDuration(3661), "1h 1m");
  assert.equal(formatDuration(null), "—");
  assert.equal(statusTone("failed"), "rose");
  assert.equal(statusTone("pending_review"), "amber");
});

test("formats relative time without crashing on absent timestamps", () => {
  assert.equal(formatRelativeTime(null), "—");
  assert.match(formatRelativeTime("2026-09-10T10:00:00Z", new Date("2026-09-10T10:01:00Z")), /ago$/);
});
