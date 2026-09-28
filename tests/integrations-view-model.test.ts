import assert from "node:assert/strict";
import test from "node:test";
import type { GitHubInstallation, SlackInstallation } from "../api/types.ts";
import type { DiscordStatus } from "../api/types.ts";
import { buildConnections, connectionFor, integrationSummary, settleConnections, visibleProviders } from "../lib/integrations.ts";

type Input = Parameters<typeof buildConnections>[0];

function github(over: Partial<GitHubInstallation> = {}): GitHubInstallation {
  return {
    id: "row-1",
    installation_id: 42,
    github_org: "acme",
    repositories: [{ full_name: "acme/api", id: 1 }, { full_name: "acme/web", id: 2 }],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
    org_name: "Acme Inc",
    ...over,
  };
}

function slack(over: Partial<SlackInstallation> = {}): SlackInstallation {
  return {
    id: "row-2",
    team_id: "T123",
    team_name: "Acme",
    bot_user_id: "U0BOT",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
    org_name: "Acme Inc",
    ...over,
  };
}

const disconnected: DiscordStatus = { connected: false, guild_id: null };
const connectedGuild: DiscordStatus = { connected: true, guild_id: "G999" };

test("one GitHub connection per installation, scoped to the GitHub org", () => {
  const connections = buildConnections({
    githubInstallations: [github()],
    slackInstallations: [],
    discord: disconnected,
  } as Input);
  assert.equal(connections.length, 1);
  assert.equal(connections[0].provider, "github");
  assert.equal(connections[0].scope, "acme");
  assert.equal(connections[0].nativeId, "42");
});

test("GitHub repository count is pluralized by actual count", () => {
  const one = buildConnections({ githubInstallations: [github({ repositories: [{ full_name: "a/b", id: 1 }] })], slackInstallations: [], discord: disconnected } as Input);
  assert.deepEqual(one[0].stats, ["1 repository accessible"]);
  const three = buildConnections({ githubInstallations: [github({ repositories: [{ full_name: "a/b", id: 1 }, { full_name: "c/d", id: 2 }, { full_name: "e/f", id: 3 }] })], slackInstallations: [], discord: disconnected } as Input);
  assert.deepEqual(three[0].stats, ["3 repositories accessible"]);
  const none = buildConnections({ githubInstallations: [github({ repositories: [] })], slackInstallations: [], discord: disconnected } as Input);
  assert.deepEqual(none[0].stats, ["0 repositories accessible"]);
});

test("multiple GitHub installations each become their own connection", () => {
  const connections = buildConnections({
    githubInstallations: [github({ installation_id: 1, github_org: "alpha" }), github({ installation_id: 2, github_org: "beta" })],
    slackInstallations: [],
    discord: disconnected,
  } as Input);
  assert.deepEqual(connections.map((c) => c.nativeId), ["1", "2"]);
  assert.deepEqual(connections.map((c) => c.scope), ["alpha", "beta"]);
});

test("Slack connection is scoped to the team name and reports the bot id", () => {
  const connections = buildConnections({
    githubInstallations: [],
    slackInstallations: [slack()],
    discord: disconnected,
  } as Input);
  assert.equal(connections.length, 1);
  assert.equal(connections[0].provider, "slack");
  assert.equal(connections[0].scope, "Acme");
  assert.equal(connections[0].nativeId, "T123");
  assert.deepEqual(connections[0].stats, ["Bot: U0BOT"]);
});

test("connected Discord yields exactly one guild connection", () => {
  const connections = buildConnections({
    githubInstallations: [],
    slackInstallations: [],
    discord: connectedGuild,
  } as Input);
  assert.equal(connections.length, 1);
  assert.equal(connections[0].provider, "discord");
  assert.equal(connections[0].scope, "Guild: G999");
  assert.equal(connections[0].nativeId, "G999");
});

test("disconnected Discord yields no connection even though a guild id is absent", () => {
  const connections = buildConnections({
    githubInstallations: [],
    slackInstallations: [],
    discord: { connected: false, guild_id: "G999" } as DiscordStatus,
  } as Input);
  assert.deepEqual(connections, []);
});

test("Discord connected without a guild id still surfaces with a readable scope", () => {
  const connections = buildConnections({
    githubInstallations: [],
    slackInstallations: [],
    discord: { connected: true, guild_id: null } as DiscordStatus,
  } as Input);
  assert.equal(connections.length, 1);
  assert.equal(connections[0].scope, "Guild unknown");
});

test("all three providers coexist in one list", () => {
  const connections = buildConnections({
    githubInstallations: [github()],
    slackInstallations: [slack()],
    discord: connectedGuild,
  } as Input);
  assert.deepEqual(connections.map((c) => c.provider), ["github", "slack", "discord"]);
});

test("connection ids are unique across providers sharing a native id", () => {
  const connections = buildConnections({
    githubInstallations: [github({ installation_id: 7 })],
    slackInstallations: [slack({ team_id: "7" })],
    discord: connectedGuild,
  } as Input);
  assert.equal(new Set(connections.map((c) => c.id)).size, 3);
});

test("summary reports connected count and unconnected providers", () => {
  const two = buildConnections({ githubInstallations: [github()], slackInstallations: [slack()], discord: disconnected } as Input);
  assert.deepEqual(integrationSummary(two), { connected: 2, available: 1 });
  assert.deepEqual(integrationSummary([]), { connected: 0, available: 3 });
});

test("summary counts providers not connections when computing available", () => {
  // Mutation guard: if `available` counted connections instead of distinct
  // providers, this would read 0 (3 connections) rather than 1.
  const twoGitHub = buildConnections({ githubInstallations: [github({ installation_id: 1 }), github({ installation_id: 2 })], slackInstallations: [], discord: connectedGuild } as Input);
  assert.equal(twoGitHub.length, 3);
  assert.deepEqual(integrationSummary(twoGitHub), { connected: 3, available: 1 });
});

test("provider search only includes supported providers", () => {
  assert.deepEqual(visibleProviders("slac").map((x) => x.id), ["slack"]);
  assert.deepEqual(visibleProviders("").map((x) => x.id), ["github", "slack", "discord"]);
});

const ok = <T,>(value: T) => ({ status: "fulfilled", value }) as PromiseSettledResult<T>;
const failed = (reason: unknown) => ({ status: "rejected", reason }) as PromiseSettledResult<never>;

test("all three providers succeeding yields every connection and no failures", () => {
  const result = settleConnections({
    githubInstallations: ok([github()]),
    slackInstallations: ok([slack()]),
    discord: ok(connectedGuild),
  });
  assert.deepEqual(result.failed, []);
  assert.deepEqual(result.connections.map((c) => c.provider), ["github", "slack", "discord"]);
});

test("one rejected provider leaves the other two connections intact", () => {
  const result = settleConnections({
    githubInstallations: ok([github()]),
    slackInstallations: failed(new Error("500")),
    discord: ok(connectedGuild),
  });
  assert.deepEqual(result.connections.map((c) => c.provider), ["github", "discord"]);
  assert.deepEqual(result.failed, ["slack"]);
});

test("every rejected provider is reported by name, in provider order", () => {
  const result = settleConnections({
    githubInstallations: failed(new Error("offline")),
    slackInstallations: failed(new Error("offline")),
    discord: failed(new Error("offline")),
  });
  assert.deepEqual(result.connections, []);
  assert.deepEqual(result.failed, ["github", "slack", "discord"]);
});

test("a rejected provider falls back to empty rather than throwing", () => {
  const result = settleConnections({
    githubInstallations: failed(new Error("boom")),
    slackInstallations: ok([]),
    discord: ok(disconnected),
  });
  assert.deepEqual(result.connections, []);
  assert.deepEqual(result.failed, ["github"]);
});

test("a provider returning an empty list is not a failure", () => {
  const result = settleConnections({
    githubInstallations: ok([]),
    slackInstallations: ok([]),
    discord: ok(disconnected),
  });
  assert.deepEqual(result.connections, []);
  assert.deepEqual(result.failed, []);
});

test("connectionFor finds a connection by its provider-prefixed id", () => {
  const connections = buildConnections({
    githubInstallations: [github({ installation_id: 1 })],
    slackInstallations: [slack({ team_id: "T123" })],
    discord: connectedGuild,
  } as Input);
  assert.equal(connectionFor(connections, "slack-T123")?.nativeId, "T123");
  assert.equal(connectionFor(connections, "github-1")?.provider, "github");
});

test("connectionFor returns undefined for an unknown or cross-provider id", () => {
  const connections = buildConnections({ githubInstallations: [github({ installation_id: 1 })], slackInstallations: [], discord: disconnected } as Input);
  // A bare native id is not a valid key — ids are always provider-prefixed.
  assert.equal(connectionFor(connections, "1"), undefined);
  assert.equal(connectionFor(connections, "slack-1"), undefined);
  assert.equal(connectionFor(connections, ""), undefined);
});
