import assert from "node:assert/strict";
import test from "node:test";
import { setApiToken } from "../api/client.ts";
import {
  createDocumentationRevision,
  getDocumentation,
  getDocumentationEvaluations,
  getDocumentationHistory,
  listDocumentation,
  restoreDocumentationRevision,
  runDocumentationEvaluation,
  startDocumentationSync,
} from "../api/documentation.ts";

test("documentation API wrappers encode ids and send action payloads", async () => {
  const calls: Array<{ url: string; method?: string; body?: string }> = [];
  const originalFetch = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async (input, init) => {
    calls.push({
      url: String(input),
      method: init?.method,
      body: init?.body as string | undefined,
    });
    return new Response(JSON.stringify({ items: [], total: 0, next_cursor: null, evaluation: {}, revision: {}, job_id: "job-1" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  try {
    await listDocumentation({ query: "oauth", repository: "acme/repo", limit: 25 });
    await getDocumentation("doc/one");
    await createDocumentationRevision("doc/one", { content: "# Draft", base_source_hash: "sha" });
    await getDocumentationHistory("doc/one");
    await restoreDocumentationRevision("doc/one", "rev/one");
    await startDocumentationSync("acme/repo");
    await getDocumentationEvaluations("doc/one");
    await runDocumentationEvaluation("doc/one", "rev/one");
  } finally {
    globalThis.fetch = originalFetch;
  }

  const listUrl = new URL(calls[0].url, "http://test");
  assert.equal(listUrl.pathname, "/api/documentation");
  assert.equal(listUrl.searchParams.get("query"), "oauth");
  assert.equal(listUrl.searchParams.get("repository"), "acme/repo");
  assert.equal(listUrl.searchParams.get("limit"), "25");
  assert.equal(calls[1].url, "/api/documentation/doc%2Fone");
  assert.equal(calls[2].method, "POST");
  assert.deepEqual(JSON.parse(calls[2].body ?? "{}"), { content: "# Draft", base_source_hash: "sha" });
  assert.equal(calls[3].url, "/api/documentation/doc%2Fone/history");
  assert.equal(calls[4].url, "/api/documentation/doc%2Fone/revisions/rev%2Fone/restore");
  assert.equal(calls[5].method, "POST");
  assert.match(calls[6].url, /^\/api\/documentation\/doc%2Fone\/evaluations\?limit=20$/);
  assert.equal(calls[7].method, "POST");
});
