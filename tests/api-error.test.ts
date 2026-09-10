import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, request, setApiToken } from "../api/client.ts";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("maps FastAPI validation detail arrays to readable messages", async () => {
  setApiToken("test-token");
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    jsonResponse(422, {
      detail: [
        { loc: ["body", "review_id"], msg: "Field required", type: "missing" },
      ],
    });
  try {
    await assert.rejects(request("/x"), (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.status, 422);
      assert.equal(error.message, "Field required");
      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("falls back to a string detail when the body is not an array", async () => {
  setApiToken("test-token");
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    jsonResponse(409, { detail: "already decided" });
  try {
    await assert.rejects(request("/x"), (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.message, "already decided");
      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});