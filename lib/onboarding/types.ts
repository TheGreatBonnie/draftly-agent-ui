export type OnboardingStep =
  | "workspace"
  | "github"
  | "repository"
  | "documentation"
  | "integrations"
  | "preferences"
  | "initialize"
  | "complete";

export type OnboardingState =
  | "NOT_STARTED"
  | "WORKSPACE_CREATED"
  | "GITHUB_CONNECTED"
  | "REPOSITORY_SELECTED"
  | "DOCUMENTATION_DISCOVERED"
  | "INTEGRATIONS_CONFIGURED"
  | "PREFERENCES_CONFIGURED"
  | "INITIALIZING"
  | "COMPLETED"
  | "FAILED";

export interface OnboardingStatus {
  state: OnboardingState;
  completed_steps: OnboardingStep[];
  failure: { step: string; detail: string } | null;
  selected_repository: Record<string, unknown> | null;
  stage_config: StageConfig[] | null;
}

export interface WorkspacePayload {
  name: string;
  description?: string;
}
export interface GitHubConnectPayload {
  installation_id: number;
}
export interface RepositoryPayload {
  full_name: string;
  default_branch?: string;
}
export interface SourcesPayload {
  include?: string[];
  exclude?: string[];
}
export interface IntegrationsPayload {
  slack?: boolean;
  discord?: boolean;
}
export interface PreferencesPayload {
  style?: string;
  review_policy?: string;
  auto_publish?: boolean;
  automation?: {
    detect_drift: boolean;
    evaluate_docs: boolean;
    suggest_improvements: boolean;
    reply_to_questions: boolean;
    auto_publish_low_risk: boolean;
  };
}
export interface DiscoveryResult {
  candidates: string[];
  count: number;
  total_files: number;
}

export interface StageConfig {
  id: string;
  label: string;
  order: number;
}
export interface InitializeStatus {
  state: OnboardingState;
  stage: string | null;
  failure: { step: string; detail: string } | null;
  stage_config: StageConfig[] | null;
  run_id?: string;
  ticket?: string;
}
