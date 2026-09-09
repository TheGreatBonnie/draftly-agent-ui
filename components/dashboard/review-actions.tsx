"use client";
import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/dashboard/ui";

import { decideReview, type ReviewDecisionResult } from "@/api/github";
import {
  buildReviewDecision,
  canDecideReview,
  type ReviewDecisionKind,
} from "@/lib/review-actions";

export interface ReviewActionsProps {
  runId: string;
  status: string;
  onDecisionSaved?: (result: ReviewDecisionResult) => void;
}

export default function ReviewActions({ runId, status, onDecisionSaved }: ReviewActionsProps) {
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actionable = canDecideReview(status);

  async function submitDecision(kind: ReviewDecisionKind) {
    if (pending || !actionable) return;
    if (kind === "request_changes" && !comment.trim()) {
      setError("Add a comment explaining the changes the agents should make.");
      return;
    }
    setPending(true);
    setError(null);
    const decision = buildReviewDecision(runId, kind, comment);
    try {
      const result = await decideReview(decision.runId, decision.decision, decision.comment);
      setComment("");
      onDecisionSaved?.(result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setPending(false);
    }
  }

  if (!actionable) return null;

  return (
    <div className="space-y-3 p-4">
      <div>
        <label htmlFor="review-decision-comment" className="text-xs font-medium text-foreground-secondary">
          Reviewer comment
        </label>
        <textarea
          id="review-decision-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="mt-2 min-h-24 w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          placeholder="Explain what the agents should address..."
          disabled={pending}
        />
        <p className="mt-1 text-xs text-foreground-muted">
          A comment is required when requesting changes.
        </p>
      </div>
      {error && <p role="alert" className="text-xs text-danger">{error}</p>}
      <div className="grid gap-2 sm:grid-cols-3">
        <Button
          onClick={() => { void submitDecision("approve"); }}
          disabled={pending}
          className="border-emerald-300 text-emerald-700">
          <Check className="h-4 w-4" />
          Approve
        </Button>
        <Button
          onClick={() => { void submitDecision("request_changes"); }}
          disabled={pending}
          className="border-amber-300 text-amber-700">
          <RotateCcw className="h-4 w-4" />
          Request changes
        </Button>
        <Button
          onClick={() => { void submitDecision("reject"); }}
          disabled={pending}
          className="border-rose-300 text-rose-700">
          <X className="h-4 w-4" />
          Reject
        </Button>
      </div>
    </div>
  );
}
