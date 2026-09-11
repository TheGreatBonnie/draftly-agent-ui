import Link from "next/link";
import { AlertTriangle, ArrowRight, CircleAlert, Database, FileCheck2, FileText, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { OverviewSnapshot } from "@/api/overview";
import { Card, IconTile } from "@/components/dashboard/ui";

type AttentionItem = { title: string; subtitle: string; href: string; tone: "rose" | "amber" | "violet" | "blue"; Icon: LucideIcon };

export function AttentionPanel({ attention }: { attention: OverviewSnapshot["attention"] }) {
  const items: AttentionItem[] = [
    { title: `${attention.pending_reviews} reviews pending`, subtitle: `${attention.high_risk_reviews} high risk`, href: "/reviews/pending", tone: "rose", Icon: FileCheck2 },
    { title: `${attention.pending_interventions} interventions pending`, subtitle: attention.pending_interventions ? "Human decision required" : "No paused agent actions", href: "/workflows?status=pending_intervention", tone: "rose", Icon: ShieldAlert },
    { title: `${attention.failed_evaluations} failed evaluations`, subtitle: attention.failed_evaluations ? "Needs investigation" : "No failed runs", href: "/evaluations/runs", tone: "amber", Icon: CircleAlert },
    { title: `${attention.integration_issues} data source issue${attention.integration_issues === 1 ? "" : "s"}`, subtitle: attention.integration_issues ? "Check connected integrations" : "All sources connected", href: "/integrations", tone: "violet", Icon: Database },
    { title: `${attention.stale_documentation} stale documentation area${attention.stale_documentation === 1 ? "" : "s"}`, subtitle: "No updates in 30+ days", href: "/documentation/outdated", tone: "blue", Icon: FileText },
  ];
  const hasAttention = Object.values(attention).some((value) => value > 0);
  return <Card className="border-brand/20 bg-gradient-to-br from-brand-soft/70 via-surface to-surface p-1"><div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><IconTile size="sm" tone="rose"><AlertTriangle aria-hidden="true" className="h-4 w-4" /></IconTile><h2 className="font-semibold">{hasAttention ? "Needs your attention" : "Everything is up to date"}</h2></div><p className="mt-2 max-w-2xl text-sm text-foreground-muted">{hasAttention ? "Resolve the highest-impact documentation issues before they become stale or block a release." : "There are no outstanding documentation or integration issues."}</p></div><Link href="/reviews/needs-attention" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline">Review all <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div><div className="grid gap-2 border-t border-border/70 p-3 sm:grid-cols-2 xl:grid-cols-4">{items.map(({ title, subtitle, href, tone, Icon }) => <Link key={title} href={href} className="group flex items-center gap-3 rounded-xl border border-border/70 bg-surface/80 p-3 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-sm"><IconTile size="sm" tone={tone}><Icon aria-hidden="true" className="h-4 w-4" /></IconTile><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{title}</span><span className="mt-0.5 block truncate text-xs text-foreground-muted">{subtitle}</span></span><ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground-muted transition group-hover:translate-x-0.5 group-hover:text-brand" /></Link>)}</div></Card>;
}
