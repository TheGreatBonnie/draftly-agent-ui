import { request } from "./client.ts";
import { deleteGitHubInstallation } from "./github.ts";
import { deleteSlackInstallation } from "./slack.ts";
import { deleteDiscordLink } from "./discord.ts";

export type IntegrationProvider = "github" | "slack" | "discord";

export interface IntegrationProviderInfo {
  id: IntegrationProvider;
  name: string;
  description: string;
}

export interface DisconnectTarget {
  provider: IntegrationProvider;
  nativeId: string;
}

/** Each provider disconnects through a differently-shaped endpoint, so the
 *  routing lives here rather than in the components. Discord has no id in its
 *  path because the backend holds the guild binding itself. */
export async function disconnectConnection({ provider, nativeId }: DisconnectTarget): Promise<unknown> {
  switch (provider) {
    case "github":
      return deleteGitHubInstallation(Number(nativeId));
    case "slack":
      return deleteSlackInstallation(encodeURIComponent(nativeId));
    case "discord":
      return deleteDiscordLink();
  }
  throw new Error(`Unsupported provider: ${provider}`);
}
