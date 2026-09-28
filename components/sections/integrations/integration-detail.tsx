"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { ArrowLeft, RefreshCw, Unplug } from "lucide-react";
import { Button, Card, PageHeader } from "@/components/dashboard/ui";
import { IntegrationIcon, ConnectedBadge } from "./integration-icon";
import { useIntegrations } from "@/hooks/use-integrations";
import type { Connection } from "@/lib/integrations.ts";
import { PROVIDERS } from "@/lib/integrations.ts";
import { disconnectConnection } from "@/api/integrations.ts";
import { getInstallUrl } from "@/api/github.ts";
import { getSlackInstallUrl } from "@/api/slack.ts";
import { getDiscordInviteUrl } from "@/api/discord.ts";
import type { IntegrationProvider } from "@/api/integrations.ts";

async function connectUrl(provider: IntegrationProvider): Promise<string> {
  if (provider === "github") return (await getInstallUrl(`/integrations/${provider}`)).install_url;
  if (provider === "slack") return (await getSlackInstallUrl()).install_url;
  return (await getDiscordInviteUrl()).invite_url;
}

/** Label/value rows describing one connected account. */
function Facts({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="divide-y divide-border">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
          <dt className="text-sm text-foreground-muted">{label}</dt>
          <dd className="truncate font-mono text-xs text-foreground-secondary" title={value}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-muted px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </Card>
  );
}

function NotConnected({ onConnect, busy }: { onConnect: () => void; busy: boolean }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-border-strong px-6 py-16 text-center">
      <div>
        <h3 className="font-semibold text-foreground">Not connected</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-foreground-muted">
          Connect an account to see its details here.
        </p>
        <Button primary className="mt-5" disabled={busy} onClick={onConnect}>
          {busy ? "Opening…" : "Connect"}
        </Button>
      </div>
    </div>
  );
}

export function IntegrationDetail({ provider }: { provider: IntegrationProvider }) {
  const info = PROVIDERS.find((item) => item.id === provider)!;
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const { connections, loading, refresh, orgId } = useIntegrations();
  const matches = useMemo(() => connections.filter((item) => item.provider === provider), [connections, provider]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function connect() {
    if (busy) return;
    setBusy("connect");
    setError(null);
    try {
      window.location.assign(await connectUrl(provider));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start the connection flow");
      setBusy(null);
    }
  }

  async function disconnect(connection: Connection) {
    if (busy) return;
    setBusy(connection.id);
    setError(null);
    try {
      await disconnectConnection({ provider: connection.provider, nativeId: connection.nativeId });
      refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not disconnect");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className="mb-1">
        <Link href="/integrations" className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-foreground-muted transition hover:text-brand">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Integrations / {info.name}
        </Link>
      </div>

      <PageHeader
        title={`${info.name} integration`}
        subtitle={info.description}
        actions={
          <Button onClick={refresh} ariaLabel={`Reload ${info.name} details`}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reload
          </Button>
        }
      />

      {!orgId && !loading && (
        <Card className="p-5 text-sm text-foreground-secondary">Select an organization to view its integrations.</Card>
      )}

      {error && (
        <Card className="mb-4 border-danger/30 bg-danger-soft p-4">
          <p role="alert" className="text-sm text-danger">{error}</p>
        </Card>
      )}

      {orgId && (loading && matches.length === 0 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-56 animate-pulse rounded-lg bg-surface-subtle" />
          <div className="h-56 animate-pulse rounded-lg bg-surface-subtle lg:col-span-2" />
        </div>
      ) : matches.length === 0 ? (
        <NotConnected busy={busy === "connect"} onConnect={() => void connect()} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            {matches.map((connection) => (
              <Panel
                key={connection.id}
                title="Connection"
                action={connection.provider === provider ? <ConnectedBadge /> : null}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface-subtle p-2 text-foreground-secondary">
                    <IntegrationIcon provider={connection.provider} />
                  </div>
                  <p className="min-w-0 truncate font-medium text-foreground">{connection.scope}</p>
                </div>
                <Facts rows={[["Account", connection.scope], ["Identifier", connection.nativeId || "—"]]} />
                {isAdmin && (
                  <Button
                    className="mt-4 w-full"
                    onClick={() => void disconnect(connection)}
                    disabled={Boolean(busy)}
                    ariaLabel={`Disconnect ${connection.scope}`}>
                    <Unplug className="h-4 w-4" aria-hidden="true" />
                    {busy === connection.id ? "Disconnecting…" : "Disconnect"}
                  </Button>
                )}
              </Panel>
            ))}
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            {matches.map((connection) => (
              <Panel key={connection.id} title={`${info.name} details`}>
                <Facts
                  rows={[
                    ["Provider", info.name],
                    ["Account", connection.scope],
                    ["Status", "Connected"],
                    ...connection.stats.map((stat): [string, string] => {
                      const separator = stat.indexOf(":");
                      return separator === -1
                        ? [stat, "—"]
                        : [stat.slice(0, separator).trim(), stat.slice(separator + 1).trim()];
                    }),
                  ]}
                />
              </Panel>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
