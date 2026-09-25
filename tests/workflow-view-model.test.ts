import test from "node:test";
import assert from "node:assert/strict";
import {
  filterWorkflows,
  formatDuration,
  formatRelativeTime,
  interventionStatusLabel,
  getWorkflowStages,
  statusTone,
  toWorkflowRunRow,
  mergeWorkflowRunPages,
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

test("maps a run to its observed stage sequence", () => {
  const row = toWorkflowRunRow({
    id: "run-1", definition_id: "def-1", source: "github", source_event_id: null,
    event_type: "pull_request.opened", title: "Update docs", repository: "acme/docs",
    actor: null, target: null, status: "running", current_stage: "research",
    stage_states: { classify: "completed", research: "running" },
    stage_sequence: ["classify", "research"], input: null, output: null, error: null,
    started_at: null, completed_at: null, created_at: null, updated_at: null,
  });
  assert.equal(row.currentStage, "Research");
  assert.deepEqual(row.stages.map((stage) => stage.status), ["completed", "running"]);
  assert.equal(row.href, "/workflows/def-1/runs/run-1");
});

test("links runs without a definition to their run detail", () => {
  const row = toWorkflowRunRow({
    id: "adhoc-1", definition_id: null, source: "github", source_event_id: null,
    event_type: null, title: null, repository: null, actor: null, target: null,
    status: "queued", current_stage: null, stage_states: {}, stage_sequence: [],
    input: null, output: null, error: null, started_at: null, completed_at: null,
    created_at: null, updated_at: null,
  });
  assert.equal(row.href, "/workflows/runs/adhoc-1");
  assert.equal(row.currentStage, "Queued");
});

test("refreshing the first page preserves later runs and updates overlapping rows", () => {
  const run = (id: string, status: "queued" | "running") => ({ id, status });
  const merged = mergeWorkflowRunPages(
    [run("new", "running"), run("older", "running")],
    [run("older", "queued"), run("oldest", "queued")],
  );
  assert.deepEqual(merged.map((item) => item.id), ["new", "older", "oldest"]);
  assert.equal(merged[1].status, "running");
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
  assert.equal(statusTone("pending_intervention"), "rose");
  assert.equal(interventionStatusLabel("pending"), "Awaiting decision");
});

test("formats relative time without crashing on absent timestamps", () => {
  assert.equal(formatRelativeTime(null), "—");
  assert.match(formatRelativeTime("2026-09-10T10:00:00Z", new Date("2026-09-10T10:01:00Z")), /ago$/);
});
