import type { LucideIcon } from "lucide-react";
import { CircleAlert, Database, FileCheck2, FileText } from "lucide-react";

export const workflowItems = [
  { name: "PR Documentation", repo: "Authly", status: "Running", time: "12 min ago", href: "/workflows/pr-documentation" },
  { name: "Release Notes", repo: "Authly", status: "Running", time: "28 min ago", href: "/workflows/release-notes" },
  { name: "Support Intelligence", repo: "Authly", status: "Running", time: "1 hour ago", href: "/workflows/support-intelligence" },
  { name: "Scheduled Audit", repo: "All repositories", status: "Scheduled", time: "In 6 hours", href: "/workflows/scheduled-audit" },
] as const;

export const changeItems = [
  { title: "Update OAuth authentication guide", detail: "docs/authentication.md • PR #142", time: "12 min ago", status: "In review", tone: "blue" },
  { title: "Add Redis caching guide", detail: "docs/redis/caching.md • Issue #87", time: "45 min ago", status: "In review", tone: "blue" },
  { title: "API rate limits documentation", detail: "docs/api/rate-limits.md • PR #138", time: "1 hour ago", status: "Needs changes", tone: "amber" },
  { title: "Deployment guide for v1.2.0", detail: "docs/deployment.md • Release v1.2.0", time: "3 hours ago", status: "Approved", tone: "green" },
  { title: "Legacy auth migration guide", detail: "docs/migration/legacy.md • Issue #65", time: "5 hours ago", status: "Published", tone: "green" },
] as const;

type AttentionItem = { title: string; subtitle: string; href: string; tone: "rose" | "amber" | "violet" | "blue"; Icon: LucideIcon };

export const attentionItems: AttentionItem[] = [
  { title: "12 reviews pending", subtitle: "3 high risk", href: "/reviews/pending", tone: "rose", Icon: FileCheck2 },
  { title: "3 failed evaluations", subtitle: "Needs investigation", href: "/evaluations/runs", tone: "amber", Icon: CircleAlert },
  { title: "1 data source issue", subtitle: "Discord connection error", href: "/integrations/discord", tone: "violet", Icon: Database },
  { title: "2 stale documentation areas", subtitle: "No updates in 30+ days", href: "/documentation/outdated", tone: "blue", Icon: FileText },
];

export const systemItems = [
  { label: "Agents", value: "4/4 online" },
  { label: "Data sources", value: "3/3 connected" },
  { label: "Evaluations", value: "Running" },
  { label: "Scheduler", value: "Healthy" },
] as const;

export const evaluationItems = [
  ["Correctness", 94, "green"], ["Completeness", 91, "blue"], ["Grounding", 90, "violet"], ["Consistency", 88, "amber"], ["Relevance", 95, "green"],
] as const;
