"use client";

import { useEffect, useState } from "react";
import {
  getKnowledgeEmbeddingStats,
  getKnowledgeGraph,
  getKnowledgeSources,
  getKnowledgeTopics,
  type KnowledgeEmbeddingStats,
  type KnowledgeGraph,
  type KnowledgeSourceSummary,
  type KnowledgeTopics,
} from "@/api/knowledge";

export function useKnowledgeSurfaces() {
  const [sources, setSources] = useState<KnowledgeSourceSummary[]>([]);
  const [graph, setGraph] = useState<KnowledgeGraph | null>(null);
  const [topics, setTopics] = useState<KnowledgeTopics>({ items: [] });
  const [embeddings, setEmbeddings] = useState<KnowledgeEmbeddingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getKnowledgeSources(controller.signal),
      getKnowledgeGraph(controller.signal),
      getKnowledgeTopics(controller.signal),
      getKnowledgeEmbeddingStats(controller.signal),
    ])
      .then(([nextSources, nextGraph, nextTopics, nextEmbeddings]) => {
        setSources(nextSources);
        setGraph(nextGraph);
        setTopics(nextTopics);
        setEmbeddings(nextEmbeddings);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Failed to load Knowledge surfaces");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { sources, graph, topics, embeddings, loading, error };
}
