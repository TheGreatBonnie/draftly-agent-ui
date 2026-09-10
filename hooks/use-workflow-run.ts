"use client";

import { useCallback, useMemo } from "react";
import { getWorkflowRun, getWorkflowRunArtifacts, getWorkflowRunSteps } from "@/api/workflows";
import { useLiveRefresh } from "@/hooks/use-live-refresh";
import { useWorkflowEvents } from "@/hooks/use-workflow-events";

export function useWorkflowRun(id: string) {
  const fetchRun = useCallback(async () => {
    const [detail, steps, artifacts] = await Promise.all([
      getWorkflowRun(id),
      getWorkflowRunSteps(id),
      getWorkflowRunArtifacts(id),
    ]);
    return { ...detail, steps: steps.items, artifacts: artifacts.items };
  }, [id]);
  const data = useLiveRefresh(fetchRun, ["workflow:changed", "review:completed"], 10_000);
  const live = useWorkflowEvents(id, { basePath: "/workflow-runs" });
  const mergedSteps = useMemo(() => {
    const persisted = data.data?.steps ?? [];
    const known = new Set(persisted.map((step) => `${String(step.seq)}:${String(step.name)}`));
    const liveSteps = live.events
      .filter((event) => event.type === "node_start" || event.type === "node_stop" || event.type === "tool_progress")
      .map((event) => ({ seq: event.seq, name: String(event.payload.name ?? event.node_id ?? event.type), status: event.type === "node_stop" ? String(event.payload.status ?? "completed").toLowerCase() : "running", detail: event.payload }));
    return [...persisted, ...liveSteps.filter((step) => !known.has(`${step.seq}:${step.name}`))];
  }, [data.data?.steps, live.events]);
  return { ...data, live, steps: mergedSteps, artifacts: data.data?.artifacts ?? [] };
}
