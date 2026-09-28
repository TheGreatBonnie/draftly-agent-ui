"use client";

import { useCallback, useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { listInstallations } from "@/api/github.ts";
import { listSlackInstallations } from "@/api/slack.ts";
import { getDiscordStatus } from "@/api/discord.ts";
import { settleConnections, type Connection } from "@/lib/integrations.ts";
import type { IntegrationProvider } from "@/api/integrations.ts";
import { useLiveVersion } from "@/components/live-events/live-events-provider";

interface State {
  orgId: string | null;
  connections: Connection[];
  failed: IntegrationProvider[];
  error: string | null;
  loading: boolean;
}

const EMPTY: State = { orgId: null, connections: [], failed: [], error: null, loading: true };

/** Fetches each provider independently so one failing integration still renders
 *  the other two; `failed` names the providers that could not be read. */
export function useIntegrations() {
  const { organization, isLoaded } = useOrganization();
  const orgId = organization?.id ?? null;
  const version = useLiveVersion(["integration:changed"]);
  const [state, setState] = useState<State>(EMPTY);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!orgId) {
      setState({ ...EMPTY, loading: false });
      return;
    }
    let cancelled = false;
    setState((current) => ({ ...current, orgId, loading: true, error: null }));

    Promise.allSettled([listInstallations(), listSlackInstallations(), getDiscordStatus()])
      .then(([githubInstallations, slackInstallations, discord]) => {
        if (cancelled) return;
        const { connections, failed } = settleConnections({ githubInstallations, slackInstallations, discord });
        const allFailed = failed.length === 3;
        setState((current) => ({
          orgId,
          connections,
          failed,
          error: allFailed ? "Unable to load integrations" : null,
          loading: false,
        }));
      })
      .catch((cause: unknown) => {
        // allSettled only rejects if a fetch throws synchronously; keep the
        // previous data on screen rather than blanking the page.
        if (cancelled) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: cause instanceof Error ? cause.message : "Unable to load integrations",
        }));
      });

    const timer = setInterval(() => setRefreshKey((key) => key + 1), 30_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [isLoaded, orgId, version, refreshKey]);

  const ready = isLoaded && Boolean(orgId) && state.orgId === orgId;

  return {
    connections: ready ? state.connections : [],
    failed: ready ? state.failed : [],
    error: ready ? state.error : null,
    loading: !isLoaded || (Boolean(orgId) && !ready),
    refresh,
    orgId,
  };
}
