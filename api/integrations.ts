import { request } from "./client.ts";

export type IntegrationProvider = "github" | "slack" | "discord";
export type IntegrationHealthStatus = "unknown" | "healthy" | "degraded" | "error";

export interface IntegrationSource {
  external_id: string;
  name: string;
  type: string;
  enabled: boolean;
}

export interface IntegrationConnection {
  id: string;
  provider: IntegrationProvider;
  account_name: string;
  external_id: string;
  health: { status: IntegrationHealthStatus; checked_at: string | null; message: string | null };
  sources: IntegrationSource[];
  can_configure_sources: boolean;
}

export interface IntegrationProviderInfo {
  id: IntegrationProvider;
  name: string;
  description: string;
}

export interface IntegrationsResponse {
  providers: IntegrationProviderInfo[];
  connections: IntegrationConnection[];
}

export function listIntegrations(): Promise<IntegrationsResponse> {
  return request<IntegrationsResponse>("/integrations");
}

export function getIntegration(provider: IntegrationProvider): Promise<IntegrationsResponse> {
  return request<IntegrationsResponse>(`/integrations/${provider}`);
}

export function refreshIntegration(provider: IntegrationProvider, id: string): Promise<IntegrationConnection> {
  return request<IntegrationConnection>(`/integrations/${provider}/${encodeURIComponent(id)}/refresh`, { method: "POST" });
}

export function setIntegrationSources(provider: IntegrationProvider, id: string, externalIds: string[]): Promise<IntegrationConnection> {
  return request<IntegrationConnection>(`/integrations/${provider}/${encodeURIComponent(id)}/sources`, {
    method: "PATCH",
    body: JSON.stringify({ external_ids: externalIds }),
  });
}

export function disconnectIntegration(provider: IntegrationProvider, id: string): Promise<{ status: string }> {
  return request<{ status: string }>(`/integrations/${provider}/${encodeURIComponent(id)}`, { method: "DELETE" });
}
