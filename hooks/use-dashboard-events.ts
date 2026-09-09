"use client";

import { useEffect, useRef } from "react";
import { getApiToken } from "@/api/client";

type EventHandler = (payload: Record<string, unknown>) => void;

export function useDashboardEvents(handlers: Record<string, EventHandler>) {
  const handlersRef = useRef(handlers);
  // Track the last stream message id so a client-driven reconnect can resume
  // from where it left off (Redis Streams retain history; pub/sub would drop it).
  const lastIdRef = useRef("");

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let cancelled = false;

    async function connect() {
      const token = await getApiToken();
      if (!token || cancelled) return;

      try {
        const res = await fetch("/api/workflows/dashboard-ticket", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const { ticket } = await res.json();

        const lastId = lastIdRef.current
          ? `&Last-Event-ID=${encodeURIComponent(lastIdRef.current)}`
          : "";
        eventSource = new EventSource(
          `/api/workflows/events/dashboard?ticket=${ticket}${lastId}`,
        );

        for (const eventType of Object.keys(handlersRef.current)) {
          eventSource.addEventListener(
            eventType,
            ((e: MessageEvent) => {
              try {
                const data = JSON.parse(e.data);
                if (e.lastEventId) lastIdRef.current = e.lastEventId;
                handlersRef.current[eventType]?.(data.payload ?? data);
              } catch {
                // ignore bad frames
              }
            }) as EventListener,
          );
        }
      } catch {
        // SSE unavailable — SWR polling continues as fallback
      }
    }

    connect();

    return () => {
      cancelled = true;
      eventSource?.close();
    };
  }, []);
}
