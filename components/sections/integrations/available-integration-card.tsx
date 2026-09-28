"use client";

import type { IntegrationProviderInfo } from "@/api/integrations.ts";
import { IntegrationIcon } from "./integration-icon";

export function AvailableIntegrationCard({ provider, onConnect, busy }: { provider: IntegrationProviderInfo; onConnect: (id: IntegrationProviderInfo["id"]) => void; busy?: boolean }) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface-subtle p-2 text-foreground-secondary">
          <IntegrationIcon provider={provider.id} />
        </div>
        <button
          type="button"
          onClick={() => onConnect(provider.id)}
          disabled={busy}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:bg-surface-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50">
          Connect
        </button>
      </div>
      <h3 className="font-semibold text-foreground">{provider.name}</h3>
      <p className="mt-1 text-sm text-foreground-muted">{provider.description}</p>
    </div>
  );
}
