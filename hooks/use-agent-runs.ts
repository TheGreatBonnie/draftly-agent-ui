"use client";

import { useCallback, useEffect, useState } from "react";
import { listRuns } from "@/api/runs";
import { useWorkflowEvents } from "@/hooks/use-workflow-events";
import type { AgentRun, RunSummary } from "@/api/types";

export function useAgentRuns() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listRuns()
      .then((rows) => {
        if (!cancelled) {
          setRuns(rows);
          setLoaded(true);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const connectRun = useCallback(
    (runId: string | null) => setSelectedId(runId),
    [],
  );

  const selectedRun = runs.find((r) => r.run_id === selectedId) ?? null;
  const { events: frames, reason } = useWorkflowEvents(selectedId);

  // A stream-ticket 404 means the run id is genuinely unknown (stale or a
  // non-run value like an agent role). Nothing can stream for it, so derive
  // the detail away instead of showing a misleading empty run.
  const streamInvalid = reason === "unknown-run";

  const detail: AgentRun | null =
    selectedId && !streamInvalid
      ? {
          run_id: selectedId,
          surface: selectedRun?.surface ?? "",
          status: selectedRun?.status ?? "running",
          steps: frames.map((f) => ({
            seq: f.seq,
            kind: f.type === "tool_progress" ? "tool" : "node",
            name: (f.payload?.name as string) ?? f.node_id ?? f.type,
            status: (f.payload?.status as string) ?? (f.type === "node_stop" ? "completed" : "running"),
            duration_ms: (f.payload?.duration_ms as number) ?? null,
            detail: f.payload,
          })),
        }
      : null;

  return { runs, loaded, error, selectedId, selectedRun, detail, connectRun };
}
