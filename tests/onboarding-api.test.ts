import assert from "node:assert/strict";
import test from "node:test";
import { setApiToken } from "../api/client.ts";
import { refreshDocumentation, selectRepository } from "../api/onboarding.ts";

test("refreshDocumentation posts urls to /onboarding/documentation/refresh", async () => {
  const calls: Array<{ url: string; method?: string; body?: string }> = [];
  const originalFetch = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async (input, init) => {
    calls.push({
      url: String(input),
      method: init?.method,
      body: init?.body as string | undefined,
    });
    return new Response(
      JSON.stringify({ skipped: 1, replaced: 2, failed: 0, deleted: 0 }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  }) as typeof fetch;
  try {
    const result = await refreshDocumentation([
      "https://docs.example.com/a",
      "https://docs.example.com/b",
    ]);
    assert.deepEqual(result, { skipped: 1, replaced: 2, failed: 0, deleted: 0 });
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.equal(calls[0].url, "/api/onboarding/documentation/refresh");
  assert.equal(calls[0].method, "POST");
  assert.deepEqual(JSON.parse(calls[0].body ?? "{}"), {
    urls: ["https://docs.example.com/a", "https://docs.example.com/b"],
  });
});

test("selectRepository forwards source_type and documentation_config", async () => {
  const calls: Array<{ url: string; method?: string; body?: string }> = [];
  const originalFetch = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async (input, init) => {
    calls.push({
      url: String(input),
      method: init?.method,
      body: init?.body as string | undefined,
    });
    return new Response(JSON.stringify({ state: "REPOSITORY_SELECTED", repository: "docs.example.com" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  try {
    await selectRepository({
      full_name: "docs.example.com",
      source_type: "public_documentation",
      documentation_config: {
        root_url: "https://docs.example.com",
        include_paths: ["docs/**"],
      },
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.equal(calls[0].method, "POST");
  assert.deepEqual(JSON.parse(calls[0].body ?? "{}"), {
    full_name: "docs.example.com",
    source_type: "public_documentation",
    documentation_config: { root_url: "https://docs.example.com", include_paths: ["docs/**"] },
  });
});