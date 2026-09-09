import type { OnboardingStep } from "./types";

export const STEP_ORDER: OnboardingStep[] = [
  "workspace",
  "github",
  "repository",
  "documentation",
  "integrations",
  "preferences",
  "initialize",
];

export const STEP_LABELS: Record<OnboardingStep, string> = {
  workspace: "Workspace",
  github: "GitHub",
  repository: "Repository",
  documentation: "Documentation",
  integrations: "Integrations",
  preferences: "Preferences",
  initialize: "Initialize",
  complete: "Complete",
};

export const REQUIRED_STEPS: OnboardingStep[] = [
  "workspace",
  "github",
  "repository",
  "documentation",
  "initialize",
];

export const OPTIONAL_STEPS: OnboardingStep[] = ["integrations", "preferences"];

export const STATE_TO_STEP: Record<string, OnboardingStep> = {
  NOT_STARTED: "workspace",
  WORKSPACE_CREATED: "github",
  GITHUB_CONNECTED: "repository",
  REPOSITORY_SELECTED: "documentation",
  DOCUMENTATION_DISCOVERED: "integrations",
  INTEGRATIONS_CONFIGURED: "preferences",
  PREFERENCES_CONFIGURED: "initialize",
  INITIALIZING: "initialize",
  COMPLETED: "complete",
  FAILED: "initialize",
};
