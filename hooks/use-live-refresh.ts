"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveVersion } from "@/components/live-events/live-events-provider";

export interface LiveRefreshState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => void;
}

export function useLiveRefresh<T>(
  fetchFn: () => Promise<T>,
  eventTypes: readonly string[],
  fallbackIntervalMs = 30_000,
): LiveRefreshState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const version = useLiveVersion(eventTypes);
  const fetchRef = useRef(fetchFn);

  useEffect(() => {
    fetchRef.current = fetchFn;
  }, [fetchFn]);

  const refresh = useCallback(() => {
    let cancelled = false;
    setIsRefreshing(true);
    fetchRef.current()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
          setIsLoading(false);
          setIsRefreshing(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setIsLoading(false);
          setIsRefreshing(false);
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
  }, [fetchFn, refresh, version, fallbackIntervalMs]);

  return { data, error, isLoading, isRefreshing, refresh };
}
