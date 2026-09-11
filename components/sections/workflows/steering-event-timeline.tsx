"use client";

import { ShieldAlert } from "lucide-react";
import type { StreamEvent } from "@/hooks/use-workflow-events";
import { Card, IconTile } from "@/components/dashboard/ui";
import { formatRelativeTime } from "@/lib/workflow-view-model";

export function SteeringEventTimeline({ events }: { events: StreamEvent[] }) {
  if (events.length === 0) return null;
  return (
    <Card className="p-4" aria-labelledby="steering-timeline-title">
      <div className="flex items-center gap-3">
        <IconTile size="sm" tone="violet"><ShieldAlert aria-hidden="true" className="h-4 w-4" /></IconTile>
        <div><h2 id="steering-timeline-title" className="font-semibold">Steering decisions</h2><p className="text-xs text-foreground-muted">Policy decisions from the live run stream.</p></div>
      </div>
      <ol className="mt-4 space-y-3" aria-live="polite">
        {events.map((event) => {
          const payload = event.payload;
          return <li key={`${event.seq}-${event.ts}`} className="rounded-xl border border-border p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold capitalize">{String(payload.action ?? "decision")}</span><span className="text-foreground-muted">{formatRelativeTime(event.ts)}</span></div>
            <div className="mt-2 grid gap-1 text-foreground-secondary sm:grid-cols-2">
              <span>Rule: {String(payload.rule ?? "Unavailable")}</span>
              <span>Role / node: {[payload.role, event.node_id ?? payload.node_id].filter(Boolean).join(" · ") || "Unavailable"}</span>
              <span>Tool: {String(payload.tool_name ?? "Unavailable")}</span>
              <span>Interrupt: {String(payload.interrupt_id ?? "None")}</span>
            </div>
            <p className="mt-2 text-foreground-muted">{String(payload.reason ?? "No additional reason was provided.")}</p>
          </li>;
        })}
      </ol>
    </Card>
  );
}
