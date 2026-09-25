import assert from "node:assert/strict";
import test from "node:test";
import { integrationSummary, visibleProviders } from "../lib/integrations.ts";

test("integration summary counts connections and checked health", () => {
  const connections = [
    { id: "1", provider: "github", health: { status: "healthy" } },
    { id: "2", provider: "github", health: { status: "unknown" } },
    { id: "3", provider: "slack", health: { status: "degraded" } },
  ] as Parameters<typeof integrationSummary>[0];
  assert.deepEqual(integrationSummary(connections), { connected: 3, healthy: 1, needsAttention: 1 });
});

test("provider search only includes supported providers", () => {
  assert.deepEqual(visibleProviders("slac").map((x) => x.id), ["slack"]);
  assert.deepEqual(visibleProviders("").map((x) => x.id), ["github", "slack", "discord"]);
});
