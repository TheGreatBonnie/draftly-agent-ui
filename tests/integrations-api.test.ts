import assert from "node:assert/strict";
import test from "node:test";
import { setApiToken } from "../api/client.ts";
import { listInstallations } from "../api/github.ts";
import { listSlackInstallations } from "../api/slack.ts";
import { getDiscordStatus } from "../api/discord.ts";
import { disconnectConnection } from "../api/integrations.ts";

/** Records every request made while `run` executes. */
async function capture(run: () => Promise<unknown>) {
  const calls: Array<[string, string]> = [];
  const original = globalThis.fetch;
  setApiToken("test-token");
  globalThis.fetch = (async (input, init) => {
    calls.push([String(input), init?.method ?? "GET"]);
    return new Response("[]", { headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = original;
  }
  return calls;
}

test("read endpoints hit the per-provider paths", async () => {
  const calls = await capture(async () => {
    await listInstallations();
    await listSlackInstallations();
    await getDiscordStatus();
  });
  assert.deepEqual(calls, [
    ["/api/github/installations", "GET"],
    ["/api/slack/installations", "GET"],
    ["/api/discord/status", "GET"],
  ]);
});

test("GitHub disconnects by numeric installation id", async () => {
  const calls = await capture(() => disconnectConnection({ provider: "github", nativeId: "42" }));
  assert.deepEqual(calls, [["/api/github/installations/42", "DELETE"]]);
});

test("Slack disconnects by team id, not by numeric id", async () => {
  const calls = await capture(() => disconnectConnection({ provider: "slack", nativeId: "T123" }));
  assert.deepEqual(calls, [["/api/slack/installations/T123", "DELETE"]]);
});

test("Discord disconnects the whole link and ignores the native id", async () => {
  const calls = await capture(() => disconnectConnection({ provider: "discord", nativeId: "G999" }));
  assert.deepEqual(calls, [["/api/discord/link", "DELETE"]]);
});

test("path segments are encoded so a hostile id cannot escape the route", async () => {
  const calls = await capture(() => disconnectConnection({ provider: "slack", nativeId: "a/b" }));
  assert.deepEqual(calls, [["/api/slack/installations/a%2Fb", "DELETE"]]);
});

test("an unknown provider is rejected without issuing a request", async () => {
  const calls = await capture(async () => {
    await assert.rejects(
      () => disconnectConnection({ provider: "gitlab", nativeId: "1" } as never),
      /Unsupported provider/,
    );
  });
  assert.deepEqual(calls, []);
});
