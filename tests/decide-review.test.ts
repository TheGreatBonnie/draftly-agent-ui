import assert from "node:assert/strict";
import test from "node:test";
import { setApiToken } from "../api/client.ts";
import { decideReview } from "../api/github.ts";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("decideReview posts review_id and a string comment", async () => {
  setApiToken("test-token");
  let capturedUrl = "";
  let capturedBody = "";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: unknown, init: unknown) => {
    capturedUrl = String(input);
    capturedBody = String((init as RequestInit).body ?? "");
    return jsonResponse(200, { status: "resumed", run_id: "run-1" });
  };
  try {
    const result = await decideReview("run-1", "rev-1", "approve", "ship it");
    assert.equal(result.status, "resumed");
    assert.equal(capturedUrl, "/api/github/review/run-1");
    const body = JSON.parse(capturedBody) as Record<string, unknown>;
    assert.equal(body.review_id, "rev-1");
    assert.equal(body.decision, "approve");
    assert.equal(body.comment, "ship it");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("decideReview sends an empty string comment when omitted", async () => {
  setApiToken("test-token");
  let capturedBody = "";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_input: unknown, init: unknown) => {
    capturedBody = String((init as RequestInit).body ?? "");
    return jsonResponse(200, { status: "rejected", run_id: "run-1" });
  };
  try {
    await decideReview("run-1", "rev-1", "reject");
    const body = JSON.parse(capturedBody) as Record<string, unknown>;
    assert.equal(body.comment, "");
    assert.equal(body.review_id, "rev-1");
  } finally {
    globalThis.fetch = originalFetch;
  }
});