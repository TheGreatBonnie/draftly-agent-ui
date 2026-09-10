"use client";

import { useCallback } from "react";
import { getEvaluationCatalog, getEvaluationRun, getEvaluationSummary, listEvaluationRuns } from "@/api/evaluations";
import { useLiveRefresh } from "@/hooks/use-live-refresh";

const EVALUATION_EVENTS = ["evaluation:created", "workflow:changed"];

export function useEvaluations(days: 1 | 7 | 14 | 30 = 14) {
  const runs = useLiveRefresh(
    useCallback(() => listEvaluationRuns({ limit: 50 }), []),
    EVALUATION_EVENTS,
    30_000,
  );
  const summary = useLiveRefresh(
    useCallback(() => getEvaluationSummary(days), [days]),
    EVALUATION_EVENTS,
    30_000,
  );
  const catalog = useLiveRefresh(getEvaluationCatalog, EVALUATION_EVENTS, 60_000);
  return { runs, summary, catalog };
}

export function useEvaluationRun(runId: string) {
  const fetchRun = useCallback(
    () => runId ? getEvaluationRun(runId, { casesLimit: 100 }) : Promise.resolve(null),
    [runId],
  );
  return useLiveRefresh(
    fetchRun,
    EVALUATION_EVENTS,
    15_000,
  );
}
