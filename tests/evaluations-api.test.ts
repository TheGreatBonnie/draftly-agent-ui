import test from "node:test";
import assert from "node:assert/strict";
import { setApiToken } from "../api/client.ts";
import { getEvaluationCatalog, getEvaluationSummary, listEvaluationRuns } from "../api/evaluations.ts";

test("evaluation API wrappers send filters and preserve cursor pages", async () => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ input: string; init: RequestInit }> = [];
  globalThis.fetch = async (input, init) => {
    calls.push({ input: String(input), init: init ?? {} });
    return new Response(JSON.stringify({ items: [], total: 0, next_cursor: null }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  setApiToken("token");
  await listEvaluationRuns({ evaluationType: "documentation", limit: 10, cursor: "next" });
  assert.match(calls[0]?.input ?? "", /evaluation_type=documentation/);
  assert.match(calls[0]?.input ?? "", /cursor=next/);
  assert.equal(calls.length, 1);
  globalThis.fetch = originalFetch;
});

test("summary and catalog wrappers use their dedicated endpoints", async () => {
  const originalFetch = globalThis.fetch;
  const urls: string[] = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    const body = urls.at(-1)?.endsWith("catalog")
      ? { datasets: [], evaluators: [] }
      : { window_days: 7, trend: [], by_metric: [] };
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  setApiToken("token");
  await getEvaluationSummary(7);
  await getEvaluationCatalog();
  assert.deepEqual(urls, ["/api/evaluations/summary?days=7", "/api/evaluations/catalog"]);
  globalThis.fetch = originalFetch;
});
