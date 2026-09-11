"use client";

import { useCallback } from "react";
import {
  listReviews,
  type ReviewListOptions,
  type ReviewListResponse,
} from "@/api/observability";
import { useLiveRefresh } from "./use-live-refresh";
import { REVIEW_LIVE_EVENTS } from "@/lib/reviews";

export function useReviews(options: ReviewListOptions = {}) {
  const fetchReviews = useCallback(
    () => listReviews(options),
    [options.cursor, options.limit, options.status],
  );
  return useLiveRefresh<ReviewListResponse>(fetchReviews, REVIEW_LIVE_EVENTS);
}
