import type { Reviewer, UpdateReviewerPayload } from "../api/types.ts";

export interface ReviewerRow {
  id: string;
  name: string;
  initials: string;
  email: string | null;
  channels: string[];
  isActive: boolean;
  clerkUserId: string | null;
}

export function toReviewerRow(reviewer: Reviewer): ReviewerRow {
  const name = reviewer.name.trim().replace(/\s+/g, " ");
  const initials = name.split(" ").filter(Boolean).map((word) => word[0]).join("").toUpperCase().slice(0, 2);
  return {
    id: reviewer.id,
    name,
    initials,
    email: reviewer.email,
    channels: [
      ...(reviewer.notify_slack && reviewer.slack_user_id?.trim() ? ["Slack"] : []),
      ...(reviewer.notify_discord && reviewer.discord_user_id?.trim() ? ["Discord"] : []),
      ...(reviewer.notify_email && reviewer.email?.trim() ? ["Email"] : []),
    ],
    isActive: reviewer.is_active,
    clerkUserId: reviewer.clerk_user_id,
  };
}

export function filterReviewerRows(rows: ReviewerRow[], query: string): ReviewerRow[] {
  const term = query.trim().toLowerCase();
  return term ? rows.filter((row) => row.name.toLowerCase().includes(term) || row.email?.toLowerCase().includes(term)) : rows;
}

export function reviewerPermissions(role: string | undefined, currentUserId: string | null, reviewer: Reviewer) {
  const isAdmin = role === "org:admin";
  const isReviewer = role === "org:reviewer";
  const isSelf = Boolean(currentUserId && reviewer.clerk_user_id === currentUserId);
  return {
    create: isAdmin,
    edit: isAdmin || (isReviewer && isSelf),
    delete: isAdmin,
    selfRegister: isReviewer && !isSelf,
  };
}

export function canSelfRegister(role: string | undefined, currentUserId: string | null, reviewers: Reviewer[]): boolean {
  return role === "org:reviewer" && Boolean(currentUserId) && !reviewers.some((reviewer) => reviewer.clerk_user_id === currentUserId);
}

export function reviewerUpdatePayload(edit: UpdateReviewerPayload, isAdmin: boolean): UpdateReviewerPayload {
  const {
    slack_user_id, discord_user_id, notify_slack, notify_discord, notify_email,
  } = edit;
  return {
    ...(isAdmin ? { name: edit.name?.trim(), email: edit.email } : {}),
    slack_user_id, discord_user_id, notify_slack, notify_discord, notify_email,
  };
}

export function notificationDestinationError(reviewer: Pick<Reviewer, "notify_slack" | "notify_discord" | "notify_email" | "slack_user_id" | "discord_user_id" | "email">): string | null {
  if (reviewer.notify_slack && !reviewer.slack_user_id?.trim()) return "Enter a Slack User ID to enable Slack notifications.";
  if (reviewer.notify_discord && !reviewer.discord_user_id?.trim()) return "Enter a Discord User ID to enable Discord notifications.";
  if (reviewer.notify_email && !reviewer.email?.trim()) return "Enter an email address to enable email notifications.";
  return null;
}
