"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getKnowledgeStats,
  listKnowledge,
  searchKnowledge,
  type KnowledgeListItem,
  type KnowledgePage,
  type KnowledgeStats,
  type KnowledgeStatus,
} from "@/api/knowledge";

interface UseKnowledgeOptions {
  status?: KnowledgeStatus;
  query?: string;
  cursor?: string;
}

interface UseKnowledge {
  page: KnowledgePage | null;
  items: KnowledgeListItem[];
  stats: KnowledgeStats | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useKnowledge({ status, query = "", cursor }: UseKnowledgeOptions = {}): UseKnowledge {
  const [page, setPage] = useState<KnowledgePage | null>(null);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState(query.trim());

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const itemsRequest = debouncedQuery
      ? searchKnowledge(debouncedQuery, 50, controller.signal).then((result) => ({
          items: result.items,
          total: result.total,
          next_cursor: null,
        }))
      : listKnowledge({ status, cursor, signal: controller.signal });

    Promise.all([itemsRequest, getKnowledgeStats(controller.signal)])
      .then(([nextPage, nextStats]) => {
        setPage(nextPage);
        setStats(nextStats);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Failed to load knowledge");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [cursor, debouncedQuery, nonce, status]);

  const reload = useCallback(() => setNonce((current) => current + 1), []);
  return { page, items: page?.items ?? [], stats, loading, error, reload };
}
