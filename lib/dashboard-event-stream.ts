export type DashboardEventHandler = (payload: Record<string, unknown>) => void;

interface DashboardMessage {
  data: string;
  lastEventId?: string;
}

interface DashboardEventSource {
  onerror: (() => void) | null;
  addEventListener(
    eventType: string,
    listener: (event: DashboardMessage) => void,
  ): void;
  close(): void;
}

interface TicketResponse {
  ok: boolean;
  json(): Promise<{ ticket?: string }>;
}

interface DashboardEventStreamOptions {
  getToken(): Promise<string | null>;
  fetchTicket?(token: string): Promise<TicketResponse>;
  createEventSource?(url: string): DashboardEventSource;
  handlers: Record<string, DashboardEventHandler> | (() => Record<string, DashboardEventHandler>);
  reconnectDelayMs?: number;
  schedule?(callback: () => void, delayMs: number): unknown;
  cancelSchedule?(handle: unknown): void;
}

export interface DashboardEventStream {
  connect(): Promise<void>;
  close(): void;
}

export function createDashboardEventStream(
  options: DashboardEventStreamOptions,
): DashboardEventStream {
  const fetchTicket = options.fetchTicket ?? (async (token: string) => {
    return fetch("/api/workflows/dashboard-ticket", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  });
  const createEventSource = options.createEventSource ?? ((url: string) => (
    new EventSource(url) as unknown as DashboardEventSource
  ));
  const schedule = options.schedule ?? ((callback, delayMs) => setTimeout(callback, delayMs));
  const cancelSchedule = options.cancelSchedule ?? ((handle) => clearTimeout(handle as ReturnType<typeof setTimeout>));
  const reconnectDelayMs = options.reconnectDelayMs ?? 1_000;

  let source: DashboardEventSource | null = null;
  let reconnectHandle: unknown = null;
  let connecting: Promise<void> | null = null;
  let stopped = false;
  let lastEventId = "";

  const currentHandlers = () => (
    typeof options.handlers === "function" ? options.handlers() : options.handlers
  );

  function reconnect(): void {
    if (stopped || reconnectHandle !== null) return;
    reconnectHandle = schedule(() => {
      reconnectHandle = null;
      void connect();
    }, reconnectDelayMs);
  }

  async function open(): Promise<void> {
    const token = await options.getToken();
    if (!token || stopped) return;

    try {
      const response = await fetchTicket(token);
      if (!response.ok) {
        reconnect();
        return;
      }
      const { ticket } = await response.json();
      if (!ticket || stopped) {
        reconnect();
        return;
      }

      const lastId = lastEventId
        ? `&Last-Event-ID=${encodeURIComponent(lastEventId)}`
        : "";
      const nextSource = createEventSource(
        `/api/workflows/events/dashboard?ticket=${encodeURIComponent(ticket)}${lastId}`,
      );
      source = nextSource;

      for (const eventType of Object.keys(currentHandlers())) {
        nextSource.addEventListener(eventType, (event) => {
          try {
            const data = JSON.parse(event.data) as Record<string, unknown>;
            if (event.lastEventId) lastEventId = event.lastEventId;
            const payload = data.payload;
            currentHandlers()[eventType]?.(
              payload && typeof payload === "object"
                ? payload as Record<string, unknown>
                : data,
            );
          } catch {
            // Ignore malformed frames without disconnecting a healthy stream.
          }
        });
      }

      nextSource.onerror = () => {
        if (source === nextSource) source = null;
        nextSource.close();
        reconnect();
      };
    } catch {
      reconnect();
    }
  }

  function connect(): Promise<void> {
    if (stopped) return Promise.resolve();
    if (connecting) return connecting;
    connecting = open().finally(() => {
      connecting = null;
    });
    return connecting;
  }

  return {
    connect,
    close() {
      stopped = true;
      if (reconnectHandle !== null) cancelSchedule(reconnectHandle);
      reconnectHandle = null;
      source?.close();
      source = null;
    },
  };
}
