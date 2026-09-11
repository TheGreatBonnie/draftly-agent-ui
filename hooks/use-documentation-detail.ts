"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDocumentation,
  getDocumentationEvaluations,
  getDocumentationHistory,
  type DocumentationDetail,
  type DocumentationEvaluation,
  type DocumentationRevision,
} from "@/api/documentation";

export function useDocumentationDetail(id: string) {
  const [document, setDocument] = useState<DocumentationDetail | null>(null);
  const [history, setHistory] = useState<DocumentationRevision[]>([]);
  const [evaluations, setEvaluations] = useState<DocumentationEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getDocumentation(id),
      getDocumentationHistory(id),
      getDocumentationEvaluations(id),
    ])
      .then(([detail, revisions, evaluationResponse]) => {
        if (cancelled) return;
        setDocument(detail);
        setHistory(revisions.items);
        setEvaluations(evaluationResponse.items);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : "Failed to load document");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, nonce]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);
  return { document, history, evaluations, loading, error, reload };
}
