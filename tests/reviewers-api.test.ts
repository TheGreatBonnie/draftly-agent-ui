import assert from "node:assert/strict";
import test from "node:test";
import { setApiToken } from "../api/client.ts";
import { createReviewer, deleteReviewer, getReviewer, listReviewers, registerSelf, updateReviewer } from "../api/reviewers.ts";

test("reviewer API includes inactive records and encodes reviewer ids", async () => {
  const calls: { url: string; method: string; body: unknown }[] = [];
  const originalFetch = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async (input, init) => {
    calls.push({ url: String(input), method: init?.method ?? "GET", body: init?.body ? JSON.parse(String(init.body)) : null });
    return new Response(JSON.stringify({ reviewers: [], status: "deleted" }), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  try {
    await listReviewers({ activeOnly: false });
    await getReviewer("person/one");
    await createReviewer({ name: "Ada", notify_email: true });
    await updateReviewer("person/one", { notify_email: false });
    await deleteReviewer("person/one");
    await registerSelf({ notify_slack: false });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(calls, [
    { url: "/api/reviewers?active_only=false", method: "GET", body: null },
    { url: "/api/reviewers/person%2Fone", method: "GET", body: null },
    { url: "/api/reviewers", method: "POST", body: { name: "Ada", notify_email: true } },
    { url: "/api/reviewers/person%2Fone", method: "PUT", body: { notify_email: false } },
    { url: "/api/reviewers/person%2Fone", method: "DELETE", body: null },
    { url: "/api/reviewers/self", method: "POST", body: { notify_slack: false } },
  ]);
});
