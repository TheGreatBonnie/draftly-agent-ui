"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useDashboardEvents } from "@/hooks/use-dashboard-events";

const DASHBOARD_EVENT_TYPES = [
  "workflow:changed",
  "evaluation:created",
  "documentation:changed",
  "documentation:published",
  "review:completed",
];

const LiveVersionContext = createContext(0);

export function LiveEventsProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);
  const handlers = useMemo(
    () => Object.fromEntries(
      DASHBOARD_EVENT_TYPES.map((eventType) => [
        eventType,
        () => setVersion((current) => current + 1),
      ]),
    ),
    [],
  );

  useDashboardEvents(handlers);

  return (
    <LiveVersionContext.Provider value={version}>
      {children}
    </LiveVersionContext.Provider>
  );
}

export function useLiveEventVersion(): number {
  return useContext(LiveVersionContext);
}

export function useLiveVersion(_eventTypes: readonly string[]): number {
  return useLiveEventVersion();
}
