import assert from "node:assert/strict";
import test from "node:test";
import { setApiToken } from "../api/client.ts";
import { getKnowledgeDetail, listKnowledge, searchKnowledge } from "../api/knowledge.ts";

test("Knowledge API wrappers preserve bounded query parameters and encoded ids", async () => {
  const calls: Array<{ url: string; signal?: AbortSignal }> = [];
  const originalFetch = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async (input, init) => {
    calls.push({ url: String(input), signal: init?.signal ?? undefined });
    return new Response(JSON.stringify({ items: [], total: 0, next_cursor: null, query: "oauth" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  const controller = new AbortController();
  try {
    await listKnowledge({ status: "verified", limit: 50, cursor: "opaque cursor", signal: controller.signal });
    await searchKnowledge("oauth tokens", 20, controller.signal);
    await getKnowledgeDetail("item/one", controller.signal);
  } finally {
    globalThis.fetch = originalFetch;
  }

  const listUrl = new URL(calls[0].url, "http://test");
  assert.equal(listUrl.pathname, "/api/knowledge");
  assert.equal(listUrl.searchParams.get("status"), "verified");
  assert.equal(listUrl.searchParams.get("limit"), "50");
  assert.equal(listUrl.searchParams.get("cursor"), "opaque cursor");
  assert.match(calls[1].url, /\/api\/knowledge\/search\?q=oauth\+tokens&limit=20$/);
  assert.equal(calls[2].url, "/api/knowledge/item%2Fone");
  assert.equal(calls[0].signal, controller.signal);
});
