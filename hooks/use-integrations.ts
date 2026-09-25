"use client";

import { useCallback, useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { listIntegrations, type IntegrationsResponse } from "@/api/integrations";
import { useLiveVersion } from "@/components/live-events/live-events-provider";

export function useIntegrations() {
  const { organization, isLoaded } = useOrganization();
  const orgId = organization?.id ?? null;
  const version = useLiveVersion(["integration:changed"]);
  const [state, setState] = useState<{ orgId: string | null; data: IntegrationsResponse | null; error: string | null; loading: boolean }>({ orgId: null, data: null, error: null, loading: true });
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!orgId) {
      setState({ orgId: null, data: null, error: null, loading: false });
      return;
    }
    let cancelled = false;
    setState((current) => ({ orgId, data: current.orgId === orgId ? current.data : null, error: null, loading: true }));
    listIntegrations()
      .then((data) => { if (!cancelled) setState({ orgId, data, error: null, loading: false }); })
      .catch((cause: unknown) => { if (!cancelled) setState((current) => ({ orgId, data: current.orgId === orgId ? current.data : null, error: cause instanceof Error ? cause.message : "Unable to load integrations", loading: false })); });
    const timer = setInterval(() => setRefreshKey((key) => key + 1), 30_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [isLoaded, orgId, version, refreshKey]);

  return { data: state.orgId === orgId ? state.data : null, error: state.orgId === orgId ? state.error : null, loading: !isLoaded || (Boolean(orgId) && (state.orgId !== orgId || state.loading)), refresh, orgId };
}
