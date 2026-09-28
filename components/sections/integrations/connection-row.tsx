"use client";

import type { Connection } from "@/lib/integrations.ts";
import { ConnectedBadge, IntegrationIcon } from "./integration-icon";
import { PROVIDERS } from "@/lib/integrations.ts";

function providerName(provider: Connection["provider"]): string {
  return PROVIDERS.find((item) => item.id === provider)?.name ?? provider;
}

export function ConnectionRow({ connection, onDisconnect }: { connection: Connection; onDisconnect?: (connection: Connection) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 last:border-b-0">
      <div className="flex min-w-0 items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface-subtle p-2 text-foreground-secondary">
          <IntegrationIcon provider={connection.provider} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">{providerName(connection.provider)}</p>
            <ConnectedBadge />
          </div>
          <p className="mt-0.5 truncate text-sm text-foreground-secondary">{connection.scope}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {connection.stats.map((stat) => (
              <li key={stat} className="rounded border border-border bg-surface-subtle px-2 py-0.5 font-mono text-[11px] text-foreground-muted">
                {stat}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {onDisconnect && (
        <button
          type="button"
          onClick={() => onDisconnect(connection)}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-foreground-muted transition hover:bg-danger-soft hover:text-danger">
          Disconnect
        </button>
      )}
    </div>
  );
}
