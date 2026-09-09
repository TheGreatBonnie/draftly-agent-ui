"use client";

import { useCallback } from "react";
import { getOverview, type OverviewSnapshot } from "@/api/overview";
import { useLiveRefresh } from "@/hooks/use-live-refresh";
import { type ChartRange } from "@/lib/dashboard-state";
import { rangeToDays } from "@/lib/overview";

const OVERVIEW_EVENTS = [
  "workflow:changed",
  "evaluation:created",
  "documentation:changed",
  "documentation:published",
  "review:completed",
];

export function useOverview(range: ChartRange) {
  const days = rangeToDays(range);
  const fetchOverview = useCallback(
    (): Promise<OverviewSnapshot> => getOverview(days),
    [days],
  );
  return useLiveRefresh(fetchOverview, OVERVIEW_EVENTS, 30_000);
}
