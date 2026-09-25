"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { Plus, RefreshCw } from "lucide-react";
import { createReviewer, deleteReviewer, listReviewers, registerSelf, updateReviewer } from "@/api/reviewers";
import type { Reviewer } from "@/api/types";
import { Button, PageHeader } from "@/components/dashboard/ui";
import { canSelfRegister, filterReviewerRows, reviewerUpdatePayload, toReviewerRow } from "@/lib/reviewers";
import { ReviewerForm, type ReviewerFormValues } from "./reviewer-form";
import { ReviewersTable } from "./reviewers-table";
import { RoleDefinitions } from "./role-definitions";

type FormState = { mode: "create" } | { mode: "self" } | { mode: "edit"; reviewer: Reviewer };

export function ReviewersPage() {
  const { userId } = useAuth();
  const { organization, membership, isLoaded } = useOrganization();
  const role = membership?.role;
  const isAdmin = role === "org:admin";
  const isReviewer = role === "org:reviewer";
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loadedOrgId, setLoadedOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!organization?.id) {
      setReviewers([]);
      setLoadedOrgId(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    listReviewers({ activeOnly: false })
      .then((response) => { if (!cancelled) { setReviewers(response.reviewers); setLoadedOrgId(organization.id); } })
      .catch((cause: unknown) => { if (!cancelled) { setReviewers([]); setLoadedOrgId(organization.id); setError(cause instanceof Error ? cause.message : "Unable to load reviewers"); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isLoaded, organization?.id, refreshKey]);

  useEffect(() => { setForm(null); }, [organization?.id]);

  const visibleReviewers = loadedOrgId === organization?.id ? reviewers : [];
  const visibleLoading = loading || !isLoaded || loadedOrgId !== organization?.id;
  const rows = useMemo(() => filterReviewerRows(visibleReviewers.map(toReviewerRow), search), [visibleReviewers, search]);
  const showSelfRegistration = canSelfRegister(role, userId ?? null, visibleReviewers) && !visibleLoading && !error;

  async function submit(values: ReviewerFormValues) {
    const activeForm = form;
    if (!activeForm || busy) return;
    setBusy(true);
    setError(null);
    try {
      const notifications = {
        slack_user_id: values.slack_user_id,
        discord_user_id: values.discord_user_id,
        notify_slack: values.notify_slack,
        notify_discord: values.notify_discord,
        notify_email: values.notify_email,
      };
      if (activeForm.mode === "create") {
        if (!isAdmin) return;
        await createReviewer({ ...notifications, name: values.name.trim(), email: values.email.trim() || undefined });
      } else if (activeForm.mode === "self") {
        if (!isReviewer) return;
        await registerSelf(notifications);
      } else {
        const isSelf = Boolean(userId && activeForm.reviewer.clerk_user_id === userId);
        if (!isAdmin && !(isReviewer && isSelf)) return;
        const payload = reviewerUpdatePayload({
          ...notifications, name: values.name, email: values.email.trim() || null,
        }, isAdmin);
        await updateReviewer(activeForm.reviewer.id, payload);
      }
      setForm(null);
      setRefreshKey((prior) => prior + 1);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Unable to save reviewer");
    } finally {
      setBusy(false);
    }
  }

  async function remove(reviewer: Reviewer) {
    if (!isAdmin || busy || !window.confirm(`Delete ${reviewer.name}? This removes the reviewer record.`)) return;
    setBusy(true);
    setError(null);
    try {
      await deleteReviewer(reviewer.id);
      if (form?.mode === "edit" && form.reviewer.id === reviewer.id) setForm(null);
      setRefreshKey((prior) => prior + 1);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Unable to delete reviewer");
    } finally {
      setBusy(false);
    }
  }

  return <>
    <PageHeader title="Reviewers" subtitle="Manage reviewer records and notification preferences for this organization." />
    {error && <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"><span>{error}</span><button type="button" onClick={() => setError(null)} className="font-medium underline">Dismiss</button></div>}
    {!organization?.id && isLoaded ? <div className="rounded-xl border border-border bg-surface p-6 text-sm text-foreground-muted">Select an organization to view reviewers.</div> : <>
      {showSelfRegistration && form?.mode !== "self" && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand-soft p-4"><div><h2 className="font-semibold text-foreground">Register as a reviewer</h2><p className="text-sm text-foreground-secondary">Add yourself and choose how to receive review notifications.</p></div><Button primary onClick={() => setForm({ mode: "self" })}>Register</Button></div>}
      {form?.mode === "self" && <div className="mb-4 overflow-hidden rounded-xl border border-border bg-surface"><ReviewerForm key="self" mode="self" isAdmin={false} busy={busy} onCancel={() => setForm(null)} onSubmit={submit} /></div>}
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section aria-label="Reviewer records" className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl border border-b-0 border-border bg-surface-subtle p-4">
            <label className="min-w-[220px] flex-1 sm:max-w-xs"><span className="sr-only">Search reviewers</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reviewers..." className="h-10 w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20" /></label>
            <div className="flex gap-2"><Button ariaLabel="Refresh reviewers" onClick={() => setRefreshKey((prior) => prior + 1)} disabled={loading || busy}><RefreshCw aria-hidden="true" className="h-4 w-4" /></Button>{isAdmin && <Button primary onClick={() => setForm(form?.mode === "create" ? null : { mode: "create" })} disabled={busy}><Plus aria-hidden="true" className="h-4 w-4" />{form?.mode === "create" ? "Cancel" : "Add reviewer"}</Button>}</div>
          </div>
          {(form?.mode === "create" || form?.mode === "edit") && <div className="border-x border-border"><ReviewerForm key={form.mode === "edit" ? form.reviewer.id : "create"} mode={form.mode} reviewer={form.mode === "edit" ? form.reviewer : undefined} isAdmin={isAdmin} busy={busy} onCancel={() => setForm(null)} onSubmit={submit} /></div>}
          <ReviewersTable rows={rows} reviewers={visibleReviewers} role={role} currentUserId={userId ?? null} loading={visibleLoading} search={search} onEdit={(reviewer) => setForm({ mode: "edit", reviewer })} onDelete={remove} />
        </section>
        <RoleDefinitions />
      </div>
    </>}
  </>;
}
