import { request } from "./client.ts";
import type {
  Reviewer,
  CreateReviewerPayload,
  UpdateReviewerPayload,
  OrgMember,
  AssignRolePayload,
  SelfRegisterPayload,
} from "./types";

export async function listReviewers(options: { activeOnly?: boolean } = {}): Promise<{ reviewers: Reviewer[] }> {
  const query = options.activeOnly === undefined ? "" : `?active_only=${options.activeOnly}`;
  return request(`/reviewers${query}`);
}

export async function getReviewer(id: string): Promise<Reviewer> {
  return request(`/reviewers/${encodeURIComponent(id)}`);
}

export async function createReviewer(
  payload: CreateReviewerPayload,
): Promise<Reviewer> {
  return request("/reviewers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateReviewer(
  id: string,
  payload: UpdateReviewerPayload,
): Promise<Reviewer> {
  return request(`/reviewers/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteReviewer(
  id: string,
): Promise<{ status: string }> {
  return request(`/reviewers/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function registerSelf(
  payload: SelfRegisterPayload,
): Promise<Reviewer> {
  return request("/reviewers/self", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listOrgMembers(): Promise<{ members: OrgMember[] }> {
  return request("/reviewers/org-members");
}

export async function assignRole(
  payload: AssignRolePayload,
): Promise<{
  membership_id: string;
  role: string;
  role_name: string;
}> {
  return request("/reviewers/assign-role", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
