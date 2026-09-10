"use client";

import { useCallback, useEffect, useState } from "react";
import { getAgent, type AgentDetailResponse } from "@/api/agents";

export function useAgentDetail(id: string | undefined) {
  const [data, setData] = useState<AgentDetailResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const retry = useCallback(() => setRequestVersion((value) => value + 1), []);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getAgent(id)
      .then((response) => {
        if (!controller.signal.aborted) {
          setData(response);
          setLoading(false);
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "Unable to load agent");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [id, requestVersion]);

  return { data, loading, error, retry };
}
