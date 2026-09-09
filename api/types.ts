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
  role: string;
  name: string;
  description: string;
  surface: string;
  tools: string[];
  status: "idle" | "running" | "completed" | "failed";
  activity: string;
  history: AgentHistoryEntry[];
}

export interface RunSummary {
  run_id: string;
  agent_name: string;
  status: "running" | "completed" | "failed";
  surface: string;
  started_at: string;
  finished_at?: string | null;
  last_step_at?: string | null;
}

export interface RunStepSummary {
  seq: number;
  kind: string;
  name: string;
  status: string;
  duration_ms?: number | null;
  detail?: Record<string, unknown>;
}

export interface AgentRun {
  run_id: string;
  surface: string;
  status: string;
  steps: RunStepSummary[];
}
