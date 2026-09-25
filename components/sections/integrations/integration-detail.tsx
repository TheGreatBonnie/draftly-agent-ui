"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { ArrowLeft, RefreshCw, Unplug } from "lucide-react";
import { disconnectIntegration, refreshIntegration, setIntegrationSources, type IntegrationConnection, type IntegrationProvider } from "@/api/integrations";
import { getInstallUrl } from "@/api/github";
import { getSlackInstallUrl } from "@/api/slack";
import { getDiscordInviteUrl } from "@/api/discord";
import { Badge, Button, Card, IconTile, PageHeader } from "@/components/dashboard/ui";
import { PROVIDERS } from "@/lib/integrations";
import { useIntegrations } from "@/hooks/use-integrations";
import { IntegrationIcon } from "./integration-icon";

const healthText = { unknown: "Not checked", healthy: "Healthy", degraded: "Needs attention", error: "Access lost" } as const;

export function IntegrationDetail({ provider }: { provider: IntegrationProvider }) {
  const info = PROVIDERS.find((item) => item.id === provider)!;
  const { membership } = useOrganization();
  const admin = membership?.role === "org:admin";
  const editor = admin || membership?.role === "org:editor";
  const { data, error: loadError, loading, refresh, orgId } = useIntegrations();
  const connections = data?.connections.filter((item) => item.provider === provider) ?? [];
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(item: IntegrationConnection, action: "refresh" | "disconnect" | "sources", selected?: string[]) {
    if (busyId) return false;
    setBusyId(item.id);
    setError(null);
    try {
      if (action === "refresh") await refreshIntegration(provider, item.id);
      if (action === "sources") await setIntegrationSources(provider, item.id, selected ?? []);
      if (action === "disconnect") {
        if (!window.confirm(`Disconnect ${item.account_name} from Draftly?`)) return false;
        await disconnectIntegration(provider, item.id);
      }
      refresh();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update connection");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function connect() {
    if (busyId) return;
    setBusyId("connect");
    setError(null);
    try {
      const destination = provider === "github"
        ? (await getInstallUrl("/integrations/github")).install_url
        : provider === "slack"
          ? (await getSlackInstallUrl()).install_url
          : (await getDiscordInviteUrl()).invite_url;
      window.location.assign(destination);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start connection");
      setBusyId(null);
    }
  }

  return <>
    <Link href="/integrations" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:underline"><ArrowLeft className="h-4 w-4" /> Integrations</Link>
    <PageHeader title={info.name} subtitle={info.description} actions={admin ? <Button primary onClick={connect} disabled={busyId !== null}>Connect {info.name}</Button> : undefined} />
    {(error || loadError) && <Card className="mb-4 p-4 text-sm text-red-700"><p role="alert">{error || loadError}</p><Button onClick={refresh}>Retry</Button></Card>}
    {!orgId && !loading && <Card className="p-6 text-sm text-slate-500">Select an organization to view this integration.</Card>}
    {orgId && loading && !data && <Card className="p-6 text-sm text-slate-500">Loading {info.name} connections…</Card>}
    {orgId && !loading && connections.length === 0 && <Card className="p-6"><h2 className="font-semibold">No {info.name} connections yet</h2><p className="mt-1 text-sm text-slate-500">Connect {info.name} to use it with Draftly.</p>{admin && <Button primary className="mt-4" onClick={connect} disabled={busyId !== null}>Connect {info.name}</Button>}</Card>}
    <div className="space-y-4">{connections.map((item) => <ConnectionCard key={item.id} item={item} busy={busyId === item.id} admin={admin} editor={editor} onAction={run} />)}</div>
  </>;
}

function ConnectionCard({ item, busy, admin, editor, onAction }: { item: IntegrationConnection; busy: boolean; admin: boolean; editor: boolean; onAction: (item: IntegrationConnection, action: "refresh" | "disconnect" | "sources", selected?: string[]) => Promise<boolean> }) {
  const [selected, setSelected] = useState<string[] | null>(null);
  const ids = selected ?? item.sources.filter((source) => source.enabled).map((source) => source.external_id);
  return <Card className="p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><IconTile><IntegrationIcon provider={item.provider} /></IconTile><div><h2 className="font-semibold">{item.account_name}</h2><p className="text-xs text-slate-500">{item.external_id}</p></div></div><Badge tone={item.health.status === "healthy" ? "green" : item.health.status === "unknown" ? "slate" : "amber"}>{healthText[item.health.status]}</Badge></div>
    <p className="mt-3 text-sm text-slate-500">{item.health.checked_at ? `Last checked ${new Date(item.health.checked_at).toLocaleString()}` : "Connection has not been checked yet."}</p>
    {item.health.message && <p className="mt-1 text-sm text-amber-700">{item.health.message}</p>}
    <div className="mt-4 flex flex-wrap gap-2">{editor && <Button onClick={() => onAction(item, "refresh")} disabled={busy}><RefreshCw className="h-4 w-4" /> Refresh connection</Button>}{admin && <Button danger onClick={() => onAction(item, "disconnect")} disabled={busy}><Unplug className="h-4 w-4" /> Disconnect</Button>}</div>
    {item.provider === "github" && <div className="mt-5"><h3 className="text-sm font-semibold">Accessible repositories</h3>{item.sources.length ? <ul className="mt-2 space-y-1 text-sm text-slate-600">{item.sources.map((source) => <li key={source.external_id}>{source.name}</li>)}</ul> : <p className="mt-2 text-sm text-slate-500">Refresh to discover repositories.</p>}</div>}
    {item.provider === "discord" && <div className="mt-5"><h3 className="text-sm font-semibold">Trigger channels</h3><p className="mt-1 text-xs text-slate-500">Select the channels that can trigger Draftly. An empty selection allows all channels.</p>{item.sources.length ? <div className="mt-2 space-y-2">{item.sources.map((source) => <label key={source.external_id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ids.includes(source.external_id)} disabled={!editor || busy} onChange={(event) => setSelected(event.target.checked ? [...ids, source.external_id] : ids.filter((id) => id !== source.external_id))} />{source.name}</label>)}{editor && <Button className="mt-2" disabled={busy || selected === null} onClick={async () => { if (await onAction(item, "sources", ids)) setSelected(null); }}>Save channels</Button>}</div> : <p className="mt-2 text-sm text-slate-500">Refresh to discover channels.</p>}</div>}
  </Card>;
}
