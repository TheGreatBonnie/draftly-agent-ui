import type { DocumentationStatus } from "@/api/documentation";

export function documentationHref(id: string): string {
  return `/documentation/${encodeURIComponent(id)}`;
}

export function documentationStatusLabel(status: string | null | undefined): string {
  const labels: Record<string, string> = {
    indexed: "Published",
    published: "Published",
    "needs-review": "Needs review",
    "needs-verification": "Needs verification",
    stale: "Stale",
    draft: "Draft",
  };
  return labels[status ?? ""] ?? "Unknown";
}

export function documentationStatusFilter(status: string): DocumentationStatus | undefined {
  if (status === "all") return undefined;
  return status as DocumentationStatus;
}

export function formatDocumentationDate(value: string | null | undefined): string {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Not available";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}
