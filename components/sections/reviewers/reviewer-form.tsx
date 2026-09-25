"use client";

import { useState, type FormEvent } from "react";
import type { Reviewer } from "@/api/types";
import { Button } from "@/components/dashboard/ui";

export interface ReviewerFormValues {
  name: string;
  email: string;
  slack_user_id: string;
  discord_user_id: string;
  notify_slack: boolean;
  notify_discord: boolean;
  notify_email: boolean;
}

export function ReviewerForm({
  mode, reviewer, isAdmin, busy, onCancel, onSubmit,
}: {
  mode: "create" | "edit" | "self";
  reviewer?: Reviewer;
  isAdmin: boolean;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (values: ReviewerFormValues) => void;
}) {
  const [values, setValues] = useState<ReviewerFormValues>({
    name: reviewer?.name ?? "",
    email: reviewer?.email ?? "",
    slack_user_id: reviewer?.slack_user_id ?? "",
    discord_user_id: reviewer?.discord_user_id ?? "",
    notify_slack: reviewer?.notify_slack ?? true,
    notify_discord: reviewer?.notify_discord ?? false,
    notify_email: reviewer?.notify_email ?? false,
  });
  const canEditIdentity = mode === "create" || (mode === "edit" && isAdmin);
  const title = mode === "create" ? "New reviewer" : mode === "self" ? "Complete your registration" : canEditIdentity ? "Edit reviewer" : "Edit profile";
  const inputClass = "mt-1 h-10 w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:bg-surface-subtle disabled:text-foreground-muted";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || (canEditIdentity && !values.name.trim())) return;
    onSubmit(values);
  }

  return <form onSubmit={submit} className="border-b border-border bg-surface-subtle p-4" aria-label={title}>
    <h2 className="font-semibold text-foreground">{title}</h2>
    {mode === "create" && <p className="mt-1 text-xs text-foreground-muted">Adds a reviewer record. It does not invite a user or grant an organization role.</p>}
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {mode !== "self" && <>
        <label className="text-xs font-medium text-foreground-secondary">Name
          <input className={inputClass} required={canEditIdentity} disabled={!canEditIdentity || busy} value={values.name} onChange={(event) => setValues((prior) => ({ ...prior, name: event.target.value }))} />
        </label>
        <label className="text-xs font-medium text-foreground-secondary">Email
          <input className={inputClass} type="email" disabled={!canEditIdentity || busy} value={values.email} onChange={(event) => setValues((prior) => ({ ...prior, email: event.target.value }))} />
        </label>
      </>}
      <label className="text-xs font-medium text-foreground-secondary">Slack User ID
        <input className={inputClass} disabled={busy} value={values.slack_user_id} onChange={(event) => setValues((prior) => ({ ...prior, slack_user_id: event.target.value }))} />
      </label>
      <label className="text-xs font-medium text-foreground-secondary">Discord User ID
        <input className={inputClass} disabled={busy} value={values.discord_user_id} onChange={(event) => setValues((prior) => ({ ...prior, discord_user_id: event.target.value }))} />
      </label>
    </div>
    <fieldset className="mt-4">
      <legend className="text-xs font-medium text-foreground-secondary">Notifications</legend>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
        {(["slack", "discord", "email"] as const).map((channel) => {
          const key = `notify_${channel}` as const;
          return <label key={channel} className="flex items-center gap-2 text-sm text-foreground-secondary"><input type="checkbox" disabled={busy} checked={values[key]} onChange={(event) => setValues((prior) => ({ ...prior, [key]: event.target.checked }))} className="h-4 w-4 accent-brand" />{channel[0].toUpperCase() + channel.slice(1)}</label>;
        })}
      </div>
    </fieldset>
    <div className="mt-4 flex justify-end gap-2">
      <Button onClick={onCancel} disabled={busy}>Cancel</Button>
      <Button type="submit" primary disabled={busy || (canEditIdentity && !values.name.trim())}>{busy ? "Saving..." : mode === "create" ? "Create reviewer" : mode === "self" ? "Complete registration" : "Save changes"}</Button>
    </div>
  </form>;
}
