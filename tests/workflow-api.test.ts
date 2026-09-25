import test from "node:test";
import assert from "node:assert/strict";
import { setApiToken } from "../api/client.ts";
import { createWorkflow, getWorkflowRun, listWorkflowRuns, listWorkflows, respondToIntervention, runWorkflow } from "../api/workflows.ts";
import { normalizePageResults } from "../lib/page-evaluations.ts";

test("workflow API uses canonical endpoints and preserves encoded ids", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const originalFetch = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async (input, init) => {
    calls.push({ url: String(input), init });
    return new Response(JSON.stringify({ items: [], summary: {}, total: 0, next_cursor: null }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  try {
    await listWorkflows({ status: "active", workflowKey: "github_pr", limit: 25, cursor: "a+b" });
    await listWorkflowRuns({ limit: 50, cursor: "next/page" });
    await createWorkflow({ name: "Docs", slug: "docs", workflow_key: "github_pr" });
    await runWorkflow("id/with spaces", { title: "Manual run" }, "request-1");
    await respondToIntervention("run/1", "interrupt/1", {
      action: "guide",
      message: "Use the approved docs branch.",
      idempotency_key: "response-1",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.match(calls[0].url, /\/api\/workflows\?/);
  assert.match(calls[0].url, /workflow_key=github_pr/);
  assert.match(calls[1].url, /\/api\/workflow-runs\?/);
  assert.match(calls[1].url, /cursor=next%2Fpage/);
  assert.match(calls[2].url, /\/api\/workflows$/);
  assert.match(calls[3].url, /\/api\/workflows\/id%2Fwith%20spaces\/runs$/);
  assert.equal((calls[3].init?.headers as Record<string, string>)["Idempotency-Key"], "request-1");
  assert.match(calls[4].url, /\/api\/workflow-runs\/run%2F1\/interventions\/interrupt%2F1\/respond$/);
  assert.equal(calls[4].init?.method, "POST");
  assert.deepEqual(JSON.parse(String(calls[4].init?.body)), {
    action: "guide",
    message: "Use the approved docs branch.",
    idempotency_key: "response-1",
  });
});

test("workflow run responses surface normalized page evaluation results", async () => {
  const originalFetch = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async () => new Response(JSON.stringify({
    run: {
      id: "run-1",
      definition_id: null,
      source: "manual",
      source_event_id: null,
      event_type: null,
      title: "Run",
      repository: null,
      actor: null,
      target: null,
      status: "completed",
      current_stage: null,
      stage_states: {},
      input: null,
      output: null,
      error: null,
      started_at: null,
      completed_at: null,
      created_at: null,
      updated_at: null,
      page_results: [
        {
          page_id: "docs/oauth.md",
          path: "docs/oauth.md",
          status: "passed",
          version: 1,
          attempts: 1,
          score: 0.93,
          failed_metrics: [],
          feedback: [],
          escalation_reason: null,
        },
      ],
    },
  }), { status: 200, headers: { "content-type": "application/json" } })) as typeof fetch;

  try {
    const detail = await getWorkflowRun("run-1");
    const pages = normalizePageResults(detail.run.page_results);
    assert.equal(pages.length, 1);
    assert.equal(pages[0].path, "docs/oauth.md");
    assert.equal(pages[0].status, "passed");
    assert.equal(pages[0].score, 93);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("legacy run responses without page_results normalize to empty", async () => {
  const originalFetch = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async () => new Response(JSON.stringify({
    run: { id: "run-1", source: "manual", status: "completed", stage_states: {} },
  }), { status: 200, headers: { "content-type": "application/json" } })) as typeof fetch;

  try {
    const detail = await getWorkflowRun("run-1");
    assert.deepEqual(normalizePageResults(detail.run.page_results), []);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
