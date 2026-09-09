"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button, MockDialog } from "@/components/dashboard/ui";

import { decideReview, type ReviewDecisionResult } from "@/api/github";
import { buildReviewDecision, canDecideReview } from "@/lib/review-actions";

export interface ReviewActionsProps {
  runId: string;
  status: string;
  onDecisionSaved?: (result: ReviewDecisionResult) => void;
}

export default function ReviewActions({ runId, status, onDecisionSaved }: ReviewActionsProps) {
  const [dialog, setDialog] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actionable = canDecideReview(status);

  async function submitDecision() {
    if (!dialog || pending || !actionable) return;
    setPending(true);
    setError(null);
    const decision = buildReviewDecision(runId, dialog === "approve", comment);
    try {
      const result = await decideReview(decision.runId, decision.approved, decision.comment);
      setDialog(null);
      setComment("");
      onDecisionSaved?.(result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setPending(false);
    }
  }

  if (!actionable) return <span className="text-xs text-foreground-muted">Decision recorded</span>;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setDialog("approve")}
          disabled={pending}
          className="border-emerald-300 text-emerald-700">
          <Check className="h-4 w-4" />
          Approve
        </Button>
        <Button
          onClick={() => setDialog("reject")}
          disabled={pending}
          className="border-rose-300 text-rose-700">
          <X className="h-4 w-4" />
          Reject
        </Button>
      </div>
      {error && <p className="mt-2 max-w-xs text-xs text-danger">{error}</p>}
      <MockDialog
        open={dialog !== null}
        onClose={() => { if (!pending) setDialog(null); }}
        title={
          dialog === "approve"
            ? "Approve documentation change?"
            : "Reject this change?"
        }
        description={
          dialog === "approve"
            ? "The approved change will move to delivery."
            : "This proposal will be marked rejected."
        }
        confirmLabel={
          pending ? "Submitting…" : dialog === "approve" ? "Approve" : "Reject"
        }
        danger={dialog === "reject"}
        closeOnConfirm={false}
        confirmDisabled={pending}
        onConfirm={() => { void submitDecision(); }}>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="h-24 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none"
          placeholder="Add an optional comment..."
          disabled={pending}
        />
      </MockDialog>
    </>
  );
}
