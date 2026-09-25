import type { IntegrationConnection, IntegrationProviderInfo } from "../api/integrations.ts";

export const PROVIDERS: IntegrationProviderInfo[] = [
  { id: "github", name: "GitHub", description: "Connect repositories and monitor code activity." },
  { id: "slack", name: "Slack", description: "Connect a workspace for team conversations and reviews." },
  { id: "discord", name: "Discord", description: "Connect a server for community conversations and reviews." },
];

export function visibleProviders(query: string): IntegrationProviderInfo[] {
  const needle = query.trim().toLowerCase();
  return PROVIDERS.filter((provider) => `${provider.name} ${provider.description}`.toLowerCase().includes(needle));
}

export function integrationSummary(connections: IntegrationConnection[]) {
  return {
    connected: connections.length,
    healthy: connections.filter((item) => item.health.status === "healthy").length,
    needsAttention: connections.filter((item) => item.health.status === "degraded" || item.health.status === "error").length,
  };
}
