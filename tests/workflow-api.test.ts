import test from "node:test";
import assert from "node:assert/strict";
import { setApiToken } from "../api/client.ts";
import { createWorkflow, listWorkflows, runWorkflow } from "../api/workflows.ts";

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
    await createWorkflow({ name: "Docs", slug: "docs", workflow_key: "github_pr" });
    await runWorkflow("id/with spaces", { title: "Manual run" }, "request-1");
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.match(calls[0].url, /\/api\/workflows\?/);
  assert.match(calls[0].url, /workflow_key=github_pr/);
  assert.match(calls[1].url, /\/api\/workflows$/);
  assert.match(calls[2].url, /\/api\/workflows\/id%2Fwith%20spaces\/runs$/);
  assert.equal((calls[2].init?.headers as Record<string, string>)["Idempotency-Key"], "request-1");
});
