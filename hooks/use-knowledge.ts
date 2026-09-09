"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getKnowledgeStats,
  listKnowledge,
  type KnowledgeListItem,
  type KnowledgeStats,
} from "@/api/knowledge";

interface UseKnowledge {
  items: KnowledgeListItem[];
  stats: KnowledgeStats | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useKnowledge(): UseKnowledge {
  const [items, setItems] = useState<KnowledgeListItem[]>([]);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listKnowledge(), getKnowledgeStats()])
      .then(([list, stat]) => {
        if (cancelled) return;
        setItems(list.items);
        setStats(stat);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load knowledge");
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