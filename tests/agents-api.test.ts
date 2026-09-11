import assert from "node:assert/strict";
import test from "node:test";
import { setApiToken } from "../api/client.ts";
import { getAgent, listAgentRuns, listAgents } from "../api/agents.ts";
import { getRunSteps, listRuns } from "../api/runs.ts";

test("agent API wrappers use stable encoded endpoints", async () => {
  const calls: string[] = [];
  const originalFetch = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async (input) => {
    calls.push(String(input));
    return new Response(JSON.stringify({ agents: [], items: [], next_cursor: null, agent: {}, metrics: {}, tools: [], recent_runs: [] }), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  try {
    await listAgents();
    await getAgent("writer/agent");
    await listAgentRuns("writer/agent", { limit: 10, cursor: "opaque" });
    await listRuns({ status: "running", limit: 5 });
    await getRunSteps("run/one");
  } finally { globalThis.fetch = originalFetch; }
  assert.equal(calls[0], "/api/agents");
  assert.equal(calls[1], "/api/agents/writer%2Fagent");
  assert.match(calls[2], /writer%2Fagent\/runs\?limit=10&cursor=opaque/);
  assert.equal(calls[3], "/api/runs?limit=5&status=running");
  assert.equal(calls[4], "/api/runs/run%2Fone/steps");
});
