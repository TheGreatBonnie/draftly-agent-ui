"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveVersion } from "@/components/live-events/live-events-provider";

export interface LiveRefreshState<T> {
  data: T | null;
  error: string | null;
  refresh: () => void;
}

export function useLiveRefresh<T>(
  fetchFn: () => Promise<T>,
  eventTypes: string[],
  fallbackIntervalMs = 30_000,
): LiveRefreshState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const version = useLiveVersion(eventTypes);
  const fetchRef = useRef(fetchFn);

  useEffect(() => {
    fetchRef.current = fetchFn;
  }, [fetchFn]);

  const refresh = useCallback(() => {
    let cancelled = false;
    fetchRef.current()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cancel = refresh();
    const id = setInterval(refresh, fallbackIntervalMs);
    return () => {
      cancel();
      clearInterval(id);
    };
  }, [refresh, version, fallbackIntervalMs]);

  return { data, error, refresh };
}