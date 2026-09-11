"use client";

import { useCallback, useEffect, useState } from "react";
import { listAgents } from "@/api/agents";
import type { AgentSummary } from "@/api/types";

export function useAgents(initialSurface?: string) {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const retry = useCallback(() => setRequestVersion((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    listAgents({ signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) {
          setAgents(response.agents);
          setLoading(false);
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "Unable to load agents");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [initialSurface, requestVersion]);

  return { agents, loading, error, retry };
}
