import { request } from "./client.ts";
import type { GitHubInstallation, GitHubInstallUrl } from "./types";

/** Fetch the GitHub App install URL. When returnTo is provided, the backend
 *  plants a short-lived cookie so /setup-callback redirects back to that route
 *  after the install completes on github.com. */
export async function getInstallUrl(returnTo?: string): Promise<GitHubInstallUrl> {
  const qs = returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : "";
  return request<GitHubInstallUrl>(`/github/install-url${qs}`);
}

export async function listInstallations(): Promise<GitHubInstallation[]> {
  return request<GitHubInstallation[]>("/github/installations");
}

export async function linkGitHubInstallation(
  installationId: number,
): Promise<{ status: string; github_org: string }> {
  return request("/github/link", {
    method: "POST",
    body: JSON.stringify({ installation_id: installationId }),
  });
}

export async function deleteGitHubInstallation(installationId: number) {
  return request(`/github/installations/${installationId}`, { method: "DELETE" });
}

export interface ReviewDecisionResult {
  status: string;
  run_id: string;
  rework_run_id?: string | null;
}

export type ReviewDecision = "approve" | "request_changes" | "reject";

/** Apply a decision to a pending review via the existing resume route
 *  (POST /github/review/{run_id}); the server trusts the stored review
 *  identity over any client-supplied reviewer id. */
export async function decideReview(
  runId: string,
  reviewId: string,
  decision: ReviewDecision,
  comment = "",
): Promise<ReviewDecisionResult> {
  return request(`/github/review/${encodeURIComponent(runId)}`, {
    method: "POST",
    body: JSON.stringify({
      review_id: reviewId,
      reviewer_id: "",
      decision,
      comment,
    }),
  });
}
