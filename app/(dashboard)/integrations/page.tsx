"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { Plus, RefreshCw } from "lucide-react";
import { Badge, Button, Card, IconTile, PageHeader, SearchBox } from "@/components/dashboard/ui";
import { IntegrationIcon } from "@/components/sections/integrations/integration-icon";
import { useIntegrations } from "@/hooks/use-integrations";
import { integrationSummary, visibleProviders } from "@/lib/integrations";

const healthLabel = { unknown: "Not checked", healthy: "Healthy", degraded: "Needs attention", error: "Access lost" } as const;

export default function Page() {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const [search, setSearch] = useState("");
  const { data, error, loading, refresh, orgId } = useIntegrations();
  const connections = data?.connections ?? [];
  const summary = integrationSummary(connections);
  const providers = useMemo(() => visibleProviders(search), [search]);

  return <>
    <PageHeader title="Integrations" subtitle="Manage the tools connected to your organization." actions={<div className="flex gap-2"><Button onClick={refresh} ariaLabel="Refresh integrations"><RefreshCw className="h-4 w-4" /> Refresh</Button>{isAdmin && <Link href="/integrations/add"><Button primary><Plus className="h-4 w-4" /> Add integration</Button></Link>}</div>} />
    {!orgId && !loading && <Card className="p-5 text-sm text-slate-600">Select an organization to view its integrations.</Card>}
    {error && <Card className="mb-4 p-4 text-sm text-red-700"><p role="alert">{error}</p><Button onClick={refresh}>Retry</Button></Card>}
    {orgId && <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3" aria-label="Integration summary">
        {[["Connected", summary.connected], ["Healthy", summary.healthy], ["Needs attention", summary.needsAttention]].map(([label, value]) => <Card key={label} className="p-4"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold">{loading && !data ? "—" : value}</p></Card>)}
      </div>
      <section aria-labelledby="active-connections-title">
        <h2 id="active-connections-title" className="mb-3 text-lg font-semibold">Active connections</h2>
        {loading && !data ? <Card className="p-6 text-sm text-slate-500">Loading connections…</Card> : connections.length === 0 ? <Card className="p-6 text-sm text-slate-500">No integrations connected yet.</Card> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{connections.map((item) => <Card key={`${item.provider}:${item.id}`} className="p-5"><div className="flex items-start justify-between"><IconTile><IntegrationIcon provider={item.provider} /></IconTile><Badge tone={item.health.status === "healthy" ? "green" : item.health.status === "unknown" ? "slate" : "amber"}>{healthLabel[item.health.status]}</Badge></div><h3 className="mt-4 font-semibold">{data?.providers.find((provider) => provider.id === item.provider)?.name} · {item.account_name}</h3><p className="mt-1 text-sm text-slate-500">{item.sources.length} available {item.provider === "github" ? "repositories" : item.provider === "discord" ? "channels" : "sources"}</p>{item.health.message && <p className="mt-2 text-xs text-amber-700">{item.health.message}</p>}<Link href={`/integrations/${item.provider}`} className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline">Manage connection →</Link></Card>)}</div>}
      </section>
      <section aria-labelledby="available-integrations-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 id="available-integrations-title" className="text-lg font-semibold">Available integrations</h2><SearchBox value={search} onChange={setSearch} placeholder="Search integrations..." className="w-full sm:w-64" /></div>
        {providers.length === 0 ? <Card className="p-6 text-sm text-slate-500">No integrations match your search.</Card> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{providers.map((provider) => <Card key={provider.id} className="p-5"><IconTile><IntegrationIcon provider={provider.id} /></IconTile><h3 className="mt-3 font-semibold">{provider.name}</h3><p className="mt-1 min-h-10 text-sm text-slate-500">{provider.description}</p><Link href={`/integrations/${provider.id}`} className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline">{connections.some((item) => item.provider === provider.id) ? "View connections" : isAdmin ? "Connect" : "Learn more"} →</Link></Card>)}</div>}
      </section>
    </div>}
  </>;
}
