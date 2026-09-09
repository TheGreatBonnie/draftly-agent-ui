"use client";

import useSWR from "swr";
import { getRunSteps, listRuns, type RunRecord } from "../api/observability";

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
  const { data, isLoading } = useSWR("dashboard:run-steps", fetcher, {
    refreshInterval: 20_000,
    onErrorRetry: () => {},
  });

  return { items: data ?? null, loading: isLoading };
}
