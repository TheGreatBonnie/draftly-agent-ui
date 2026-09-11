"use client";

import { useEffect, useState } from "react";
import { getKnowledgeDetail, type KnowledgeDetail } from "@/api/knowledge";

export function useKnowledgeDetail(id: string) {
  const [data, setData] = useState<KnowledgeDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getKnowledgeDetail(id, controller.signal)
      .then(setData)
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Failed to load knowledge item");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  return { data, loading, error };
}
