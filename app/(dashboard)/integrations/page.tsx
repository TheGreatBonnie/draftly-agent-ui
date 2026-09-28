"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { Plug, RefreshCw } from "lucide-react";
import { Button, Card, PageHeader } from "@/components/dashboard/ui";
import { IntegrationIcon } from "@/components/sections/integrations/integration-icon";
import { ConnectionRow } from "@/components/sections/integrations/connection-row";
import { AvailableIntegrationCard } from "@/components/sections/integrations/available-integration-card";
import { useIntegrations } from "@/hooks/use-integrations";
import type { Connection } from "@/lib/integrations.ts";
import { PROVIDERS, integrationSummary, visibleProviders } from "@/lib/integrations.ts";
import { disconnectConnection } from "@/api/integrations.ts";
import { getInstallUrl } from "@/api/github.ts";
import { getSlackInstallUrl } from "@/api/slack.ts";
import { getDiscordInviteUrl } from "@/api/discord.ts";
import type { IntegrationProvider } from "@/api/integrations.ts";

/** Each provider's connect entry point. GitHub returns to /integrations/github
 *  (allowlisted server-side); Slack and Discord return via OAuth callback. */
async function connectUrl(provider: IntegrationProvider): Promise<string> {
  if (provider === "github") return (await getInstallUrl("/integrations/github")).install_url;
  if (provider === "slack") return (await getSlackInstallUrl()).install_url;
  return (await getDiscordInviteUrl()).invite_url;
}

export default function Page() {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const { connections, failed, error, loading, refresh, orgId } = useIntegrations();
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingDisconnect, setPendingDisconnect] = useState<Connection | null>(null);

  const summary = useMemo(() => integrationSummary(connections), [connections]);
  const connectedProviders = useMemo(() => new Set(connections.map((c) => c.provider)), [connections]);
  const available = useMemo(() => PROVIDERS.filter((p) => !connectedProviders.has(p.id)), [connectedProviders]);

  async function handleConnect(provider: IntegrationProvider) {
    if (busy) return;
    setBusy(provider);
    setActionError(null);
    try {
      window.location.assign(await connectUrl(provider));
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Could not start the connection flow");
      setBusy(null);
    }
  }

  async function handleDisconnect() {
    if (!pendingDisconnect || busy) return;
    const target = pendingDisconnect;
    setBusy(target.id);
    setActionError(null);
    try {
      await disconnectConnection({ provider: target.provider, nativeId: target.nativeId });
      setPendingDisconnect(null);
      refresh();
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Could not disconnect");
    } finally {
      setBusy(null);
    }
  }

  const problem = actionError ?? error;

  return (
    <>
      <PageHeader
        title="Integrations"
        subtitle="Manage the tools connected to your organization."
        actions={
          <Button onClick={refresh} ariaLabel="Refresh integrations">
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Refresh
          </Button>
        }
      />

      {!orgId && !loading && (
        <Card className="p-5 text-sm text-foreground-secondary">Select an organization to view its integrations.</Card>
      )}

      {problem && (
        <Card className="mb-4 border-danger/30 bg-danger-soft p-4">
          <p role="alert" className="text-sm text-danger">{problem}</p>
          <Button className="mt-3" onClick={refresh}>Retry</Button>
        </Card>
      )}

      {orgId && (
        <div className="space-y-5">
          <div className="flex divide-x divide-border overflow-hidden rounded-lg border border-border bg-surface" aria-label="Integration summary">
            {([["Connected", summary.connected, "text-foreground"], ["Available", summary.available, "text-foreground-muted"]] as const).map(([label, value, color]) => (
              <div key={label} className="flex flex-1 items-center justify-between px-4 py-3">
                <span className="text-xs font-medium uppercase tracking-wider text-foreground-muted">{label}</span>
                {loading ? (
                  <div className="h-4 w-8 animate-pulse rounded bg-surface-subtle" />
                ) : (
                  <span className={`font-mono text-sm font-medium ${color}`}>{value}</span>
                )}
              </div>
            ))}
          </div>

          {failed.length > 0 && (
            <p className="text-xs text-foreground-muted">
              Could not load {failed.map((p) => p[0].toUpperCase() + p.slice(1)).join(", ")}.
            </p>
          )}

          <Card>
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Active connections</h2>
            </div>
            {loading && connections.length === 0 ? (
              <div className="space-y-3 p-4">
                {[0, 1].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-surface-subtle" />)}
              </div>
            ) : connections.length === 0 ? (
              <div className="grid min-h-40 place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface-subtle text-foreground-muted">
                    <Plug className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">No connections yet</p>
                  <p className="mt-1 text-sm text-foreground-muted">Connect a tool below to start receiving reviews.</p>
                </div>
              </div>
            ) : (
              connections.map((connection) => (
                <ConnectionRow
                  key={connection.id}
                  connection={connection}
                  onDisconnect={isAdmin ? (target) => setPendingDisconnect(target) : undefined}
                />
              ))
            )}
          </Card>

          {available.length > 0 && (
            <Card>
              <div className="border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold text-foreground">Available</h2>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {available.map((provider) => (
                  <div key={provider.id} className="relative">
                    <AvailableIntegrationCard
                      provider={provider}
                      busy={busy === provider.id}
                      onConnect={(id) => void handleConnect(id)}
                    />
                    {isAdmin ? null : (
                      <p className="absolute inset-0 grid place-items-center rounded-lg bg-surface/70 text-xs font-medium text-foreground-secondary">
                        Admin access required
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {pendingDisconnect && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={() => setPendingDisconnect(null)}>
          <Card className="w-full max-w-md p-5 shadow-2xl">
            <div onMouseDown={(event) => event.stopPropagation()}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface-subtle p-2 text-foreground-secondary">
                  <IntegrationIcon provider={pendingDisconnect.provider} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground">Disconnect {pendingDisconnect.scope}?</h3>
                  <p className="mt-1 text-sm text-foreground-muted">
                    Draftly stops posting to this account immediately. You can reconnect at any time.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <Button onClick={() => setPendingDisconnect(null)}>Cancel</Button>
                <Button danger disabled={Boolean(busy)} onClick={() => void handleDisconnect()}>
                  {busy ? "Disconnecting…" : "Disconnect"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
