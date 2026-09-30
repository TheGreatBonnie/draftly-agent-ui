export type PageEvaluationStatus =
  | "pending"
  | "writing"
  | "evaluating"
  | "revising"
  | "passed"
  | "awaiting_human_review"
  | "failed";

export interface PageEvaluationSummary {
  pageId: string;
  path: string;
  status: PageEvaluationStatus;
  version: number;
  attempts: number;
  score: number | null;
  failedMetrics: string[];
  feedback: string[];
  escalationReason: string | null;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function integer(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "").map((item) => item.trim());
}

function normalizedScore(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value >= 0 && value <= 1 ? value * 100 : value;
}

export function normalizePageResults(value: unknown): PageEvaluationSummary[] {
  if (!Array.isArray(value)) return [];
  const pages: PageEvaluationSummary[] = [];
  for (const raw of value) {
    const item = record(raw);
    const path = text(item.path) ?? text(item.page_id);
    if (!path) continue;
    pages.push({
      pageId: text(item.page_id) ?? path,
      path,
      status: (text(item.status) ?? "pending") as PageEvaluationStatus,
      version: integer(item.version),
      attempts: integer(item.attempts),
      score: normalizedScore(item.score),
      failedMetrics: strings(item.failed_metrics),
      feedback: strings(item.feedback),
      escalationReason: text(item.escalation_reason),
    });
  }
  return pages;
}

function titleCase(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  writing: "Writing",
  evaluating: "Evaluating",
  revising: "Revising",
  passed: "Passed",
  awaiting_human_review: "Awaiting human review",
  failed: "Failed",
};

export function pageStatusLabel(status: string): string {
  const key = status.toLowerCase();
  return STATUS_LABELS[key] ?? titleCase(key);
}

export type PageStatusTone = "green" | "amber" | "rose" | "slate" | "blue";

export function pageStatusTone(status: string): PageStatusTone {
  const key = status.toLowerCase();
  if (key === "passed") return "green";
  if (key === "failed") return "rose";
  if (key === "awaiting_human_review") return "amber";
  if (key === "pending") return "slate";
  return "blue";
}

export interface PageDetailRow {
  label: string;
  value: string;
}

/** Attention order: lower rank means the reviewer should look at it sooner. */
const PAGE_ATTENTION_RANK: Record<string, number> = {
  failed: 0,
  awaiting_human_review: 1,
  revising: 2,
  pending: 3,
  writing: 3,
  evaluating: 3,
  passed: 4,
};

function pageAttentionRank(status: string): number {
  return PAGE_ATTENTION_RANK[status] ?? 4;
}

/**
 * Index of the page a reviewer should open first: the most severe page that
 * still needs attention, tie-broken by the page that was attempted most.
 * All-passed and unknown statuses carry the lowest rank, so the first page
 * wins and the card opens on list order.
 */
export function pickDefaultPageIndex(pages: PageEvaluationSummary[]): number {
  let best = 0;
  for (let index = 1; index < pages.length; index += 1) {
    const rank = pageAttentionRank(pages[index].status);
    const bestRank = pageAttentionRank(pages[best].status);
    if (rank < bestRank) best = index;
    else if (rank === bestRank && pages[index].attempts > pages[best].attempts) best = index;
  }
  return best;
}

/**
 * Normalizes a repo-relative path for comparison: trims whitespace and drops a
 * leading `./` or `/`. Case is significant, and no suffix matching is done, so
 * `reference/api.md` never matches `docs/reference/api.md`.
 */
function normalizePath(path: string): string {
  return path.trim().replace(/^\.?\//, "");
}

/**
 * The page evaluation for a document file, matched on path. The document file
 * list and the page evaluation list come from different queries and arrive in
 * different order, so index-based matching would be wrong. Returns null when
 * the file has no evaluation (e.g. a file outside the documentation set).
 */
export function findPageEvaluation(
  pages: PageEvaluationSummary[],
  path: string | null,
): PageEvaluationSummary | null {
  if (!path) return null;
  const target = normalizePath(path);
  return pages.find((item) => normalizePath(item.path) === target) ?? null;
}

/**
 * The page whose score a detail page should show for a given document file.
 *
 * With a selected file, that file's evaluation or null - a file without an
 * evaluation must never borrow a different file's score. With nothing selected,
 * fall back to the page needing the most attention so the card still opens on
 * something actionable.
 */
export function selectEvaluatedPage(
  pages: PageEvaluationSummary[],
  selectedPath: string | null,
): PageEvaluationSummary | null {
  if (pages.length === 0) return null;
  if (selectedPath) return findPageEvaluation(pages, selectedPath);
  return pages[pickDefaultPageIndex(pages)] ?? null;
}

/** Score as a clamped 0-1 fraction for a score ring. Unscored pages read as empty. */
export function pageRingProgress(page: { score: number | null }): number {
  if (page.score === null || !Number.isFinite(page.score)) return 0;
  return Math.max(0, Math.min(100, page.score)) / 100;
}

export function pageScoreLabel(score: number | null): string {
  if (score === null || !Number.isFinite(score)) return "—";
  return `${Math.round(score)}%`;
}

export interface PageScoreCoverage {
  scored: number;
  total: number;
}

/**
 * How many pages carry a score, and how many pages there are. The column
 * sub-label needs both: a review with 7 pages where 5 were scored is not the
 * same as one with 5 pages that all scored.
 */
export function pageScoreCoverage(pages: PageEvaluationSummary[]): PageScoreCoverage {
  let scored = 0;
  for (const page of pages) {
    if (page.score !== null && Number.isFinite(page.score)) scored += 1;
  }
  return { scored, total: pages.length };
}

/**
 * Mean score across the pages that have one, rounded to a whole percent.
 *
 * This averages `page_results`, which the backend builds by joining each page's
 * `latest_artifact_id` - the final evaluation per page. It must not average the
 * raw evaluation rows instead: that table keeps one row per attempt, so
 * superseded failures would count against the score (measured 87.5% against a
 * true 95.7% on one review).
 *
 * Unscored pages are skipped rather than counted as zero, since a page that was
 * never evaluated is unknown rather than bad. Returns null when nothing has been
 * scored, so callers can show "—" instead of a misleading 0%.
 */
export function averagePageScore(pages: PageEvaluationSummary[]): number | null {
  let total = 0;
  let counted = 0;
  for (const page of pages) {
    if (page.score === null || !Number.isFinite(page.score)) continue;
    total += page.score;
    counted += 1;
  }
  if (counted === 0) return null;
  return Math.round(total / counted);
}

export function pageDetailRows(page: PageEvaluationSummary): PageDetailRow[] {
  return [
    { label: "Version", value: String(page.version) },
    { label: "Attempt", value: String(page.attempts) },
    { label: "Score", value: pageScoreLabel(page.score) },
    { label: "Failed metrics", value: page.failedMetrics.length ? page.failedMetrics.join(", ") : "None" },
    { label: "Feedback", value: page.feedback.length ? page.feedback.join(" · ") : "None" },
    { label: "Escalation reason", value: page.escalationReason ?? "None" },
  ];
}