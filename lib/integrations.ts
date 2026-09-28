import type { GitHubInstallation, SlackInstallation, DiscordStatus } from "../api/types.ts";
import type { IntegrationProvider, IntegrationProviderInfo } from "../api/integrations.ts";

export const PROVIDERS: IntegrationProviderInfo[] = [
  { id: "github", name: "GitHub", description: "Connect repositories and monitor code activity." },
  { id: "slack", name: "Slack", description: "Connect a workspace for team conversations and reviews." },
  { id: "discord", name: "Discord", description: "Connect a server for community conversations and reviews." },
];

/** A single connected account, assembled from the per-provider endpoints.
 *  `nativeId` is the identifier the provider's delete endpoint expects;
 *  `id` is prefixed by provider so it stays unique as a React key. */
export interface Connection {
  id: string;
  provider: IntegrationProvider;
  nativeId: string;
  scope: string;
  stats: string[];
}

export interface ConnectionSources {
  githubInstallations: GitHubInstallation[];
  slackInstallations: SlackInstallation[];
  discord: DiscordStatus;
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `1 ${singular} accessible` : `${count} ${plural} accessible`;
}

export function githubConnections(installations: GitHubInstallation[]): Connection[] {
  return installations.map((installation) => {
    const nativeId = String(installation.installation_id);
    return {
      id: `github-${nativeId}`,
      provider: "github" as const,
      nativeId,
      scope: installation.github_org,
      stats: [pluralize(installation.repositories.length, "repository", "repositories")],
    };
  });
}

export function slackConnections(installations: SlackInstallation[]): Connection[] {
  return installations.map((installation) => ({
    id: `slack-${installation.team_id}`,
    provider: "slack" as const,
    nativeId: installation.team_id,
    scope: installation.team_name,
    stats: [`Bot: ${installation.bot_user_id}`],
  }));
}

export function discordConnections(discord: DiscordStatus): Connection[] {
  if (!discord.connected) return [];
  return [{
    id: `discord-${discord.guild_id ?? "unknown"}`,
    provider: "discord" as const,
    nativeId: discord.guild_id ?? "",
    scope: discord.guild_id ? `Guild: ${discord.guild_id}` : "Guild unknown",
    stats: ["Bot active"],
  }];
}

export function buildConnections({ githubInstallations, slackInstallations, discord }: ConnectionSources): Connection[] {
  return [
    ...githubConnections(githubInstallations),
    ...slackConnections(slackInstallations),
    ...discordConnections(discord),
  ];
}

export type ConnectionResults = {
  [K in keyof ConnectionSources]: PromiseSettledResult<ConnectionSources[K]>;
};

/** Turns the per-provider fetches into a view model. A provider that failed
 *  contributes no connections and is named in `failed`, so one broken provider
 *  never blanks the rest of the page. */
export function settleConnections(results: ConnectionResults): { connections: Connection[]; failed: IntegrationProvider[] } {
  const connections: Connection[] = [];
  const failed: IntegrationProvider[] = [];

  if (results.githubInstallations.status === "fulfilled") {
    connections.push(...githubConnections(results.githubInstallations.value));
  } else {
    failed.push("github");
  }
  if (results.slackInstallations.status === "fulfilled") {
    connections.push(...slackConnections(results.slackInstallations.value));
  } else {
    failed.push("slack");
  }
  if (results.discord.status === "fulfilled") {
    connections.push(...discordConnections(results.discord.value));
  } else {
    failed.push("discord");
  }

  return { connections, failed };
}

export function connectionFor(connections: Connection[], id: string): Connection | undefined {
  return connections.find((item) => item.id === id);
}

export function visibleProviders(query: string): IntegrationProviderInfo[] {
  const needle = query.trim().toLowerCase();
  return PROVIDERS.filter((provider) => `${provider.name} ${provider.description}`.toLowerCase().includes(needle));
}

export function integrationSummary(connections: Connection[]) {
  const connectedProviders = new Set(connections.map((item) => item.provider));
  return {
    connected: connections.length,
    available: Math.max(PROVIDERS.length - connectedProviders.size, 0),
  };
}
