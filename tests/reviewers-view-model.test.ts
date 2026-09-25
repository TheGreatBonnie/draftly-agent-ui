import assert from "node:assert/strict";
import test from "node:test";
import type { Reviewer } from "../api/types.ts";
import { canSelfRegister, filterReviewerRows, notificationDestinationError, reviewerPermissions, toReviewerRow, reviewerUpdatePayload } from "../lib/reviewers.ts";

const reviewer: Reviewer = {
  id: "reviewer-1", org_id: "org-1", name: " Ada  Lovelace ", email: null,
  slack_user_id: "U1", discord_user_id: null, notify_slack: true,
  notify_discord: false, notify_email: false, is_active: false,
  clerk_user_id: "user-1", created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
};

test("reviewer row shows initials, enabled channels, and inactive status without inventing email", () => {
  assert.deepEqual(toReviewerRow(reviewer), {
    id: "reviewer-1", name: "Ada Lovelace", initials: "AL", email: null,
    channels: ["Slack"], isActive: false, clerkUserId: "user-1",
  });
});

test("reviewer search matches names and emails case-insensitively", () => {
  const rows = [toReviewerRow(reviewer), toReviewerRow({ ...reviewer, id: "reviewer-2", name: "Grace Hopper", email: "grace@example.com" })];
  assert.deepEqual(filterReviewerRows(rows, "  GRACE@EXAMPLE "), [rows[1]]);
  assert.deepEqual(filterReviewerRows(rows, "ada"), [rows[0]]);
});

test("reviewer permissions allow admin management and only own-profile edits for reviewers", () => {
  assert.deepEqual(reviewerPermissions("org:admin", "user-2", reviewer), { create: true, edit: true, delete: true, selfRegister: false });
  assert.deepEqual(reviewerPermissions("org:reviewer", "user-1", reviewer), { create: false, edit: true, delete: false, selfRegister: false });
  assert.deepEqual(reviewerPermissions("org:reviewer", "user-2", reviewer), { create: false, edit: false, delete: false, selfRegister: true });
  assert.deepEqual(reviewerPermissions("org:member", "user-1", reviewer), { create: false, edit: false, delete: false, selfRegister: false });
});

test("own-profile update omits identity fields and sends only notification settings", () => {
  const edit = { name: "Changed", email: "new@example.com", slack_user_id: "U2", discord_user_id: "", notify_slack: false, notify_discord: true, notify_email: false };
  assert.deepEqual(reviewerUpdatePayload(edit, false), {
    slack_user_id: "U2", discord_user_id: "", notify_slack: false,
    notify_discord: true, notify_email: false,
  });
  assert.equal(reviewerUpdatePayload(edit, true).name, "Changed");
});

test("self-registration requires reviewer role and no existing record for the current user", () => {
  assert.equal(canSelfRegister("org:reviewer", "user-1", [reviewer]), false);
  assert.equal(canSelfRegister("org:reviewer", "user-2", [reviewer]), true);
  assert.equal(canSelfRegister("org:admin", "user-2", [reviewer]), false);
  assert.equal(canSelfRegister("org:reviewer", null, []), false);
});

test("channels require both an enabled preference and a usable destination", () => {
  const missing = { ...reviewer, slack_user_id: " ", notify_slack: true, notify_discord: true, notify_email: true };
  assert.deepEqual(toReviewerRow(missing).channels, []);
  assert.equal(notificationDestinationError(missing), "Enter a Slack User ID to enable Slack notifications.");
  assert.equal(notificationDestinationError({ ...missing, slack_user_id: "U1" }), "Enter a Discord User ID to enable Discord notifications.");
  assert.equal(notificationDestinationError({ ...missing, slack_user_id: "U1", discord_user_id: "D1" }), "Enter an email address to enable email notifications.");
  assert.equal(notificationDestinationError({ ...missing, slack_user_id: "U1", discord_user_id: "D1", email: "ada@example.com" }), null);
});
