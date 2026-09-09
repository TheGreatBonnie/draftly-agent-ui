import { request } from "./client";
import type {
  OnboardingStatus,
  WorkspacePayload,
  GitHubConnectPayload,
  RepositoryPayload,
  SourcesPayload,
  IntegrationsPayload,
  PreferencesPayload,
  DiscoveryResult,
  InitializeStatus,
} from "@/lib/onboarding/types";

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  return request<OnboardingStatus>("/onboarding/status");
}

export async function createWorkspace(
  payload: WorkspacePayload,
): Promise<{ state: string }> {
  return request("/onboarding/workspace", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function connectGitHub(
  payload: GitHubConnectPayload,
): Promise<{ state: string; github_org: string }> {
  return request("/onboarding/github/connect", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listGitHubRepositories(): Promise<
  { full_name: string; id: number }[]
> {
  const data = await request<{
    repositories: { full_name: string; id: number }[];
  }>("/onboarding/github/repositories");
  return data.repositories ?? [];
}

export async function selectRepository(
  payload: RepositoryPayload,
): Promise<{ state: string; repository: string }> {
  return request("/onboarding/repository", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function discoverDocumentation(): Promise<DiscoveryResult> {
  return request("/onboarding/documentation/discover", { method: "POST" });
}

export async function confirmSources(
  payload: SourcesPayload,
): Promise<{ state: string }> {
  return request("/onboarding/sources", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function configureIntegrations(
  payload: IntegrationsPayload,
): Promise<{ state: string }> {
  return request("/onboarding/integrations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function configurePreferences(
  payload: PreferencesPayload,
): Promise<{ state: string }> {
  return request("/onboarding/preferences", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function startInitialize(): Promise<{
  state: string;
  run_id?: string;
  ticket?: string;
  result?: Record<string, unknown>;
}> {
  return request("/onboarding/initialize", { method: "POST" });
}

export async function getInitializeStatus(): Promise<InitializeStatus> {
  return request("/onboarding/initialize/status");
}

export async function retryInitialize(): Promise<{
  state: string;
  run_id?: string;
  ticket?: string;
  result?: Record<string, unknown>;
}> {
  return request("/onboarding/initialize/retry", { method: "POST" });
}

export async function completeOnboarding(): Promise<{ state: string }> {
  return request("/onboarding/complete", { method: "POST" });
}
