"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MessageSquare, ShieldAlert, X } from "lucide-react";
import { respondToIntervention, type InterventionAction, type PendingIntervention } from "@/api/workflows";
import { Badge, Button, Card, IconTile } from "@/components/dashboard/ui";
import { interventionStatusLabel, statusTone } from "@/lib/workflow-view-model";

export function SteeringInterventionPanel({
  intervention,
  runId,
  onResolved,
}: {
  intervention: PendingIntervention;
  runId: string;
  onResolved: () => void;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idempotencyKey = useRef<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [intervention.interrupt_id]);

  async function respond(action: InterventionAction) {
    setBusy(true);
    setError(null);
    idempotencyKey.current ??= globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${intervention.interrupt_id}`;
    try {
      await respondToIntervention(runId, intervention.interrupt_id, {
        action,
        ...(message.trim() ? { message: message.trim() } : {}),
        idempotency_key: idempotencyKey.current,
      });
      onResolved();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div role="region" aria-labelledby={`intervention-${intervention.interrupt_id}`}>
    <Card className="border-rose-300 bg-rose-50/40 p-4">
      <div className="flex items-start gap-3">
        <IconTile size="sm" tone="rose"><ShieldAlert aria-hidden="true" className="h-4 w-4" /></IconTile>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 ref={headingRef} tabIndex={-1} id={`intervention-${intervention.interrupt_id}`} className="font-semibold outline-none">Human decision required</h2>
            <Badge tone={statusTone(intervention.status)}>{interventionStatusLabel(intervention.status)}</Badge>
          </div>
          <p className="mt-1 text-sm text-foreground-secondary" aria-live="assertive">The run is paused before an external action. Review the bounded steering context, then choose how it should continue.</p>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 rounded-xl border border-rose-200 bg-surface/80 p-3 text-xs sm:grid-cols-2">
        <div><dt className="text-foreground-muted">Requested action</dt><dd className="mt-1 font-medium">{intervention.tool_name || "External tool action"}</dd></div>
        <div><dt className="text-foreground-muted">Agent / node</dt><dd className="mt-1 font-medium">{[intervention.agent_id, intervention.node_id].filter(Boolean).join(" · ") || "Unavailable"}</dd></div>
        <div><dt className="text-foreground-muted">Policy rule</dt><dd className="mt-1 break-words font-medium">{intervention.rule || "Unavailable"}</dd></div>
        <div><dt className="text-foreground-muted">Phase / role</dt><dd className="mt-1 font-medium">{[intervention.phase, intervention.role].filter(Boolean).join(" · ") || "Unavailable"}</dd></div>
        <div className="sm:col-span-2"><dt className="text-foreground-muted">Reason</dt><dd className="mt-1 text-foreground-secondary">{intervention.reason || "No additional reason was provided."}</dd></div>
        {intervention.created_at && <div><dt className="text-foreground-muted">Requested</dt><dd className="mt-1 font-medium">{intervention.created_at}</dd></div>}
        {intervention.expires_at && <div><dt className="text-foreground-muted">Expires</dt><dd className="mt-1 font-medium">{intervention.expires_at}</dd></div>}
      </dl>
      <label className="mt-4 block text-xs font-medium" htmlFor={`intervention-message-${intervention.interrupt_id}`}>
        Optional guidance
        <textarea
          id={`intervention-message-${intervention.interrupt_id}`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={1000}
          placeholder="Tell the agent how to continue when guidance is needed."
          className="mt-1 min-h-20 w-full rounded-lg border border-border bg-input p-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          disabled={busy}
        />
      </label>
      {error && <p className="mt-3 text-sm text-rose-700" role="alert">Unable to resolve this intervention: {error}</p>}
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button danger disabled={busy} onClick={() => respond("deny")}><X aria-hidden="true" className="h-4 w-4" />Deny</Button>
        <Button disabled={busy} onClick={() => respond("guide")}><MessageSquare aria-hidden="true" className="h-4 w-4" />Guide and retry</Button>
        <Button primary disabled={busy} onClick={() => respond("approve")}><Check aria-hidden="true" className="h-4 w-4" />Approve</Button>
      </div>
    </Card>
    </div>
  );
}
