"use client";

import { useCallback } from "react";
import { getPageQualitySummary, listQualityPages } from "@/api/page-quality";
import { useLiveRefresh } from "@/hooks/use-live-refresh";

// Page evaluations are produced by the docs workflow and consumed on review
// pages, so refresh on either signal.
const PAGE_QUALITY_EVENTS = ["workflow:changed", "review:changed"] as const;

export function usePageQuality(days: 1 | 7 | 14 | 30 = 14) {
  const summary = useLiveRefresh(
    useCallback(() => getPageQualitySummary(days), [days]),
    PAGE_QUALITY_EVENTS,
    30_000,
  );
  return { summary };
}

export function useQualityPages(limit = 50) {
  return useLiveRefresh(
    useCallback(() => listQualityPages({ limit }), [limit]),
    PAGE_QUALITY_EVENTS,
    30_000,
  );
}
