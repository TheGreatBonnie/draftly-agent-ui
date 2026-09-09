"use client";
import { usePathname } from "next/navigation";
import { Tabs } from "@/components/dashboard/ui";
import type { ReviewListCounts } from "@/api/observability";

export const sectionTabs = {
  reviews: [
    { label: "All reviews", href: "/reviews" },
    { label: "Pending", href: "/reviews/pending" },
    { label: "Needs attention", href: "/reviews/needs-attention" },
    { label: "Approved", href: "/reviews/approved" },
    { label: "Rejected", href: "/reviews/rejected" },
  ],
  evaluations: [
    { label: "Overview", href: "/evaluations" },
    { label: "Runs", href: "/evaluations/runs" },
    { label: "Test cases", href: "/evaluations/test-cases" },
    { label: "Datasets", href: "/evaluations/datasets" },
    { label: "Evaluators", href: "/evaluations/evaluators" },
    { label: "Trends", href: "/evaluations/trends" },
  ],
  documentation: [
    { label: "All documents", href: "/documentation" },
    { label: "By repository", href: "/documentation/by-repository" },
    { label: "By topic", href: "/documentation/by-topic" },
    { label: "Outdated", href: "/documentation/outdated", count: 8 },
    { label: "Recently updated", href: "/documentation/recently-updated" },
  ],
  workflows: [
    { label: "All workflows", href: "/workflows" },
    { label: "Active", href: "/workflows/active", count: 6 },
    { label: "Paused", href: "/workflows/paused" },
    { label: "Drafts", href: "/workflows/drafts" },
    { label: "Templates", href: "/workflows/templates" },
  ],
  agents: [
    { label: "All agents", href: "/agents" },
    { label: "Active", href: "/agents/active", count: 8 },
    { label: "Idle", href: "/agents/idle", count: 2 },
    { label: "Templates", href: "/agents/templates" },
  ],
} as const;

export function SectionTabs({
  section,
  className = "",
  reviewCounts,
}: {
  section: keyof typeof sectionTabs;
  className?: string;
  reviewCounts?: Partial<ReviewListCounts>;
}) {
  const path = usePathname();
  const items = section === "reviews" && reviewCounts
    ? sectionTabs[section].map((item) => {
        if (item.href === "/reviews/pending") return { ...item, count: reviewCounts.pending };
        if (item.href === "/reviews/needs-attention") return { ...item, count: reviewCounts.urgent };
        if (item.href === "/reviews/approved") return { ...item, count: reviewCounts.approved };
        if (item.href === "/reviews/rejected") return { ...item, count: reviewCounts.rejected };
        return item;
      })
    : sectionTabs[section];
  const exact = items.find((x) => x.href === path);
  const active = exact?.label ?? items[0].label;
  return <Tabs items={[...items]} active={active} className={className} />;
}
