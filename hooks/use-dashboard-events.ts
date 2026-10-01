"use client";

import { useEffect, useRef } from "react";
import { getApiToken } from "@/api/client";
import { createDashboardEventStream } from "@/lib/dashboard-event-stream";

type EventHandler = (payload: Record<string, unknown>) => void;

export function useDashboardEvents(handlers: Record<string, EventHandler>) {
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const apiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
    const stream = createDashboardEventStream({
      getToken: getApiToken,
      handlers: () => handlersRef.current,
      ticketBaseUrl: "/api",
      streamBaseUrl: apiOrigin ? `${apiOrigin}/api` : "/api",
    });
    void stream.connect();

    return () => {
      stream.close();
    };
  }, []);
}
