import assert from "node:assert/strict";
import test from "node:test";
import { setApiToken } from "../api/client.ts";
import { disconnectIntegration, getIntegration, listIntegrations, refreshIntegration, setIntegrationSources } from "../api/integrations.ts";

test("integration requests are scoped to connection ids and encode paths", async () => {
  const calls: Array<[string, string, unknown]> = [];
  const original = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async (input, init) => {
    calls.push([String(input), init?.method ?? "GET", init?.body ? JSON.parse(String(init.body)) : null]);
    return new Response(JSON.stringify({ providers: [], connections: [] }), { headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  try {
    await listIntegrations();
    await getIntegration("github");
    await refreshIntegration("github", "a/b");
    await setIntegrationSources("discord", "a/b", ["channel-1"]);
    await disconnectIntegration("slack", "a/b");
  } finally {
    globalThis.fetch = original;
  }
  assert.deepEqual(calls, [
    ["/api/integrations", "GET", null],
    ["/api/integrations/github", "GET", null],
    ["/api/integrations/github/a%2Fb/refresh", "POST", null],
    ["/api/integrations/discord/a%2Fb/sources", "PATCH", { external_ids: ["channel-1"] }],
    ["/api/integrations/slack/a%2Fb", "DELETE", null],
  ]);
});
