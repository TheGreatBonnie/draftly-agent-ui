import type { ReviewViewModel } from "./reviews";

export interface ReviewFilterOptions {
  query?: string;
  repository?: string;
  type?: string;
  risk?: string;
  score?: string;
}

export function filterReviewItems(
  items: ReviewViewModel[],
  filters: ReviewFilterOptions,
): ReviewViewModel[] {
  const query = filters.query?.trim().toLowerCase() ?? "";
  return items.filter((review) => {
    const haystack = [
      review.title,
      review.description,
      review.repository,
      review.path,
      review.reference,
    ].filter(Boolean).join(" ").toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (filters.repository && review.repository !== filters.repository) return false;
    if (filters.type && review.type !== filters.type) return false;
    if (filters.risk && review.risk?.toLowerCase() !== filters.risk.toLowerCase()) return false;
    if (filters.score === "below80" && (review.score === null || review.score >= 80)) return false;
    if (filters.score === "80to89" && (review.score === null || review.score < 80 || review.score >= 90)) return false;
    if (filters.score === "90plus" && (review.score === null || review.score < 90)) return false;
    return true;
  });
}

export function reviewPageInterval(
  startIndex: number,
  itemCount: number,
  total: number,
): string {
  if (total <= 0 || itemCount <= 0) return "No reviews";
  const start = startIndex + 1;
  const end = Math.min(startIndex + itemCount, total);
  return `Showing ${start} to ${end} of ${total} reviews`;
}
