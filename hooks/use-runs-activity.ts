"use client";

import { getRunSteps, listRuns, type RunRecord } from "../api/observability";
import { useLiveRefresh } from "./use-live-refresh";

export interface AgentActivityItem {
  name: string;
  status: string;
  task: string;
}

const fetcher = async (): Promise<AgentActivityItem[]> => {
  const { items: runs } = await listRuns(undefined, 10);
  const latest: RunRecord | undefined = runs[0];
  if (!latest) return [];
  const { items: steps } = await getRunSteps(latest.run_id);
  return steps.slice(-8).map((step) => ({
    name: step.name,
    status: step.status,
    task: `${latest.event_type} · ${step.kind}`,
  }));
};

/** Latest run's ordered node/tool steps, polled via SWR. */
export function useRunsActivity(): {
  items: AgentActivityItem[] | null;
  loading: boolean;
} {
  const { data, isLoading } = useLiveRefresh(fetcher, ["workflow:changed"], 20_000);

  return { items: data ?? null, loading: isLoading };
}
