export interface GitHubInstallation {
  id: string;
  installation_id: number;
  github_org: string;
  repositories: { full_name: string; id: number }[];
  created_at: string;
  updated_at: string;
  org_name: string;
}

export interface GitHubInstallUrl {
  install_url: string;
}

export interface SlackInstallation {
  id: string;
  team_id: string;
  team_name: string;
  bot_user_id: string;
  created_at: string;
  updated_at: string;
  org_name: string;
}

export interface DiscordStatus {
  connected: boolean;
  guild_id: string | null;
}

export interface DiscordInviteUrl {
  invite_url: string;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
}

export interface DiscordTriggerChannels {
  channels: string[];
}

export interface Reviewer {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  slack_user_id: string | null;
  discord_user_id: string | null;
  notify_slack: boolean;
  notify_discord: boolean;
  notify_email: boolean;
  is_active: boolean;
  clerk_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewerPayload {
  org_id?: string;
  name: string;
  email?: string;
  slack_user_id?: string;
  discord_user_id?: string;
  notify_slack?: boolean;
  notify_discord?: boolean;
  notify_email?: boolean;
}

export interface UpdateReviewerPayload {
  name?: string;
  email?: string;
  slack_user_id?: string;
  discord_user_id?: string;
  notify_slack?: boolean;
  notify_discord?: boolean;
  notify_email?: boolean;
  is_active?: boolean;
}

export interface OrgMember {
  membership_id: string;
  user_id: string;
  email: string;
  role: string;
  role_name: string;
}

export interface AssignRolePayload {
  user_id: string;
  role: string;
}

export interface SelfRegisterPayload {
  slack_user_id?: string;
  discord_user_id?: string;
  notify_slack?: boolean;
  notify_discord?: boolean;
  notify_email?: boolean;
}

export interface AgentHistoryEntry {
  label: string;
  result: "success" | "failed";
  detail: string;
}

export interface AgentSummary {
  id: string;
  role: string;
  name: string;
  description: string;
  surface: string;
  tools: string[];
  availability: "enabled" | "disabled" | "unavailable" | string;
  last_run_status: "idle" | "running" | "completed" | "failed" | "unknown" | string;
  runs_7d: number;
  success_rate_7d: number | null;
  last_run_at: string | null;
  latest_run_id: string | null;
  legacy_steps: number;
  status?: string | null;
  activity?: string | null;
  history?: AgentHistoryEntry[];
}

export interface RunSummary {
  run_id: string;
  source: string;
  event_type: string;
  org_id: string;
  status: "running" | "completed" | "failed" | string;
  error?: string | null;
  surface: string;
  workflow_key?: string | null;
  definition_id?: string | null;
  started_at: string | null;
  completed_at?: string | null;
}

export interface RunStepSummary {
  seq: number;
  kind: string;
  name: string;
  status: string;
  duration_ms?: number | null;
  detail?: Record<string, unknown>;
  agent_id?: string | null;
  node_id?: string | null;
  surface?: string;
}

export interface AgentRun {
  run_id: string;
  surface: string;
  status: string;
  steps: RunStepSummary[];
}
