"use client";

import { useCallback } from "react";
import { getReview, type ReviewSummary } from "@/api/observability";
import { useLiveRefresh } from "./use-live-refresh";
import { REVIEW_LIVE_EVENTS } from "@/lib/reviews";

export function useReview(reviewId: string) {
  const fetchReview = useCallback(() => getReview(reviewId), [reviewId]);
  return useLiveRefresh<{ review: ReviewSummary }>(fetchReview, REVIEW_LIVE_EVENTS);
}
