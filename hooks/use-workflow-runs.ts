"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { listWorkflowRuns, type WorkflowRun, type WorkflowRunListResponse } from "@/api/workflows";
import { useLiveVersion } from "@/components/live-events/live-events-provider";
import { fetchWorkflowRunWindow } from "@/lib/workflow-run-pages";
import { mergeWorkflowRunPages } from "@/lib/workflow-view-model";

export function useWorkflowRuns() {
  const [data, setData] = useState<WorkflowRunListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const lastLoadedId = useRef<string | null>(null);
  const requestVersion = useRef(0);
  const refreshingRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const pendingRefreshRef = useRef(false);
  const version = useLiveVersion(["workflow:changed"]);

  const refresh = useCallback(async () => {
    if (loadingMoreRef.current) {
      pendingRefreshRef.current = true;
      return;
    }
    const requestId = ++requestVersion.current;
    refreshingRef.current = true;
    setIsRefreshing(true);
    try {
      const result = await fetchWorkflowRunWindow(
        (cursor) => listWorkflowRuns({ limit: 50, cursor }), lastLoadedId.current,
      );
      if (requestId !== requestVersion.current) return;
      setData(result);
      setError(null);
      if (lastLoadedId.current && !result.items.some((run) => run.id === lastLoadedId.current)) {
        lastLoadedId.current = result.items.at(-1)?.id ?? null;
      }
    } catch (cause) {
      if (requestId === requestVersion.current) setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      if (requestId === requestVersion.current) {
        refreshingRef.current = false;
        setIsRefreshing(false);
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => { void refresh(); }, 30_000);
    return () => { clearInterval(timer); requestVersion.current += 1; };
  }, [refresh, version]);

  const loadMore = useCallback(async () => {
    if (!data?.next_cursor || loadingMoreRef.current || refreshingRef.current) return;
    const requestId = requestVersion.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setPageError(null);
    try {
      const next = await listWorkflowRuns({ limit: 50, cursor: data.next_cursor });
      if (requestId !== requestVersion.current) return;
      lastLoadedId.current = next.items.at(-1)?.id ?? lastLoadedId.current;
      setData((current) => current ? {
        items: mergeWorkflowRunPages(current.items, next.items),
        total: next.total,
        next_cursor: next.next_cursor,
      } : next);
    } catch (cause) {
      if (requestId === requestVersion.current) setPageError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
      if (pendingRefreshRef.current) {
        pendingRefreshRef.current = false;
        void refresh();
      }
    }
  }, [data?.next_cursor, refresh]);

  return {
    data, items: data?.items ?? ([] as WorkflowRun[]), total: data?.total ?? 0,
    hasMore: Boolean(data?.next_cursor), error, pageError, isLoading,
    isRefreshing, loadingMore, refresh, loadMore,
  };
}
