"use client";

import { useCallback } from "react";
import { getWorkflow } from "@/api/workflows";
import { useLiveRefresh } from "@/hooks/use-live-refresh";

export function useWorkflowDetail(id: string) {
  const fetchWorkflow = useCallback(() => getWorkflow(id), [id]);
  return useLiveRefresh(fetchWorkflow, ["workflow:changed"], 15_000);
}
