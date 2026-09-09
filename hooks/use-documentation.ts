"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDocumentationStats,
  listDocumentation,
  type DocumentationRecord,
  type DocumentationStats,
} from "@/api/documentation";

interface UseDocumentation {
  items: DocumentationRecord[];
  stats: DocumentationStats | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useDocumentation(): UseDocumentation {
  const [items, setItems] = useState<DocumentationRecord[]>([]);
  const [stats, setStats] = useState<DocumentationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listDocumentation(), getDocumentationStats()])
      .then(([list, stat]) => {
        if (cancelled) return;
        setItems(list.items);
        setStats(stat);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : "Failed to load documentation",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setNonce((n) => n + 1);
  }, []);

  return { items, stats, loading, error, reload };
}