"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listAgentRuns } from "@/api/agents";
import { getRunSteps } from "@/api/runs";
import { useWorkflowEvents } from "@/hooks/use-workflow-events";
import type { RunStepSummary, RunSummary } from "@/api/types";

function eventToStep(event: {
  type: string;
  seq: number;
  node_id?: string | null;
  payload: Record<string, unknown>;
}): RunStepSummary {
  const isTool = event.type === "tool_progress";
  return {
    seq: event.seq,
    kind: isTool ? "tool" : "node",
    name: String(event.payload.name ?? event.node_id ?? event.type),
    status: String(event.payload.status ?? (event.type === "node_stop" ? "completed" : "running")),
    duration_ms: typeof event.payload.duration_ms === "number" ? event.payload.duration_ms : null,
    detail: event.payload,
    agent_id: typeof event.payload.agent_id === "string" ? event.payload.agent_id : null,
    node_id: event.node_id ?? null,
    surface: typeof event.payload.surface === "string" ? event.payload.surface : "",
  };
}

export function useAgentRuns(agentId?: string) {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [steps, setSteps] = useState<RunStepSummary[]>([]);
  const [loading, setLoading] = useState(Boolean(agentId));
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const retry = useCallback(() => setRequestVersion((value) => value + 1), []);

  useEffect(() => {
    if (!agentId) {
      setRuns([]);
      setSelectedId(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    listAgentRuns(agentId)
      .then((response) => {
        if (!controller.signal.aborted) {
          setRuns(response.items);
          setSelectedId((current) => current ?? response.items[0]?.run_id ?? null);
          setLoading(false);
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "Unable to load agent runs");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [agentId, requestVersion]);

  const selectedRun = useMemo(
    () => runs.find((run) => run.run_id === selectedId) ?? null,
    [runs, selectedId],
  );
  const stream = useWorkflowEvents(selectedId);

  useEffect(() => {
    if (!selectedId) {
      setSteps([]);
      return;
    }
    const controller = new AbortController();
    getRunSteps(selectedId)
      .then((items) => {
        if (!controller.signal.aborted) {
          setSteps((current) => {
            const bySeq = new Map(items.map((step) => [step.seq, step]));
            for (const step of current) bySeq.set(step.seq, step);
            return [...bySeq.values()].sort((a, b) => a.seq - b.seq);
          });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setSteps([]);
      });
    return () => controller.abort();
  }, [selectedId]);

  useEffect(() => {
    if (stream.events.length === 0) return;
    setSteps((current) => {
      const bySeq = new Map(current.map((step) => [step.seq, step]));
      for (const event of stream.events) bySeq.set(event.seq, eventToStep(event));
      return [...bySeq.values()].sort((a, b) => a.seq - b.seq);
    });
  }, [stream.events]);

  return {
    runs,
    selectedId,
    selectedRun,
    steps,
    loading,
    error,
    retry,
    selectRun: setSelectedId,
    streamStatus: stream.status,
    streamReason: stream.reason,
  };
}
