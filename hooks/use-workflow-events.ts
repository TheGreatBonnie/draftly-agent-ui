"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { request, ApiError } from "../api/client";

export type StreamEventType =
  | "node_start"
  | "node_stop"
  | "handoff"
  | "text_delta"
  | "tool_progress"
  | "stage_change"
  | "stage_manifest"
  | "stage_progress"
  | "overall_progress"
  | "workflow_result";

export interface StreamEvent {
  type: StreamEventType;
  run_id: string;
  seq: number;
  ts: string;
  node_id?: string | null;
  payload: Record<string, unknown>;
}

export type NodeState = "running" | "completed" | "failed";

export type StreamStatus = "idle" | "connecting" | "live" | "closed" | "error";

const EVENT_TYPES: StreamEventType[] = [
  "node_start",
  "node_stop",
  "handoff",
  "text_delta",
  "tool_progress",
  "stage_change",
  "stage_manifest",
  "stage_progress",
  "overall_progress",
  "workflow_result",
];

// A healthy SSE connection is kept alive by the server's periodic pings, so we
// do NOT tear down after an idle period. Instead we only reconnect when the
// socket itself errors (e.g. transient network blips), with capped backoff.
const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_MS = 1_000;
const MAX_RECONNECT_MS = 15_000;

export function useWorkflowEvents(
  run_id: string | null,
  options?: { ticket?: string; nonce?: number },
) {
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>({});
  const [text, setText] = useState("");
  const [reason, setReason] = useState("unknown");
  const sourceRef = useRef<EventSource | null>(null);
  const doneRef = useRef(false);
  const lastSeqRef = useRef(0);
  // Exact-seq set so duplicate/replayed events are dropped across reconnects
  // WITHOUT a monotonic watermark that would drop a genuinely-new lower seq.
  // Bounded to avoid unbounded growth on long streams.
  const seenSeqRef = useRef<Set<number>>(new Set());

  const apply = useCallback((event: StreamEvent) => {
    const seq = Number(event.seq ?? 0);
    if (seq) {
      // Exact-seen dedup: only identical (replayed/re-sent) seqs are dropped.
      // This preserves out-of-order delivery of genuinely-new lower seqs and
      // survives reconnects (as long as seenSeqRef is not cleared).
      if (seenSeqRef.current.has(seq)) return;
      seenSeqRef.current.add(seq);
      lastSeqRef.current = Math.max(lastSeqRef.current, seq);
      // Bound the set to the most recent ~2000 seqs to cap memory.
      if (seenSeqRef.current.size > 2000) {
        const overflow = new Set<number>([...seenSeqRef.current].slice(-2000));
        seenSeqRef.current = overflow;
      }
    }

    console.log("[SSE] apply event", {
      type: event.type,
      seq: event.seq,
      runId: event.run_id,
      nodeId: event.node_id,
    });
    setEvents((prev) => [...prev.slice(-500), event]);
    if (event.node_id) {
      setNodeStates((prev) => ({
        ...prev,
        [event.node_id as string]:
          event.type === "node_start"
            ? "running"
            : event.type === "node_stop"
              ? event.payload.status === "COMPLETED"
                ? "completed"
                : "failed"
              : (prev[event.node_id as string] ?? "running"),
      }));
    }
    if (event.type === "text_delta" && typeof event.payload.text === "string") {
      setText((prev) => prev + event.payload.text);
    }
    if (event.type === "workflow_result") {
      setStatus("closed");
      doneRef.current = true;
      // Close the socket so the browser's native EventSource auto-reconnect
      // does not reopen the stream with the already-consumed single-use
      // ticket (which would 403 and loop). Reconnect is only ever driven by
      // our own scheduleReconnect().
      sourceRef.current?.close();
    }
  }, []);

  useEffect(() => {
    if (!run_id) return;
    let cancelled = false;
    let reconnectAttempts = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let source: EventSource | null = null;
    doneRef.current = false;
    lastSeqRef.current = 0;
    seenSeqRef.current = new Set<number>();

    const closeSource = () => {
      source?.close();
      source = null;
      sourceRef.current = null;
    };

    const scheduleReconnect = () => {
      if (cancelled) return;
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log("[SSE] max reconnect attempts reached", {
          run_id,
          attempts: reconnectAttempts,
        });
        setStatus("error");
        return;
      }
      reconnectAttempts += 1;
      console.log("[SSE] scheduling reconnect", {
        run_id,
        attempt: reconnectAttempts,
      });
      setStatus("connecting");
      const delay = Math.min(
        BASE_RECONNECT_MS * 2 ** (reconnectAttempts - 1),
        MAX_RECONNECT_MS,
      );
      reconnectTimer = setTimeout(() => {
        void connect();
      }, delay);
    };

    const connect = async () => {
      if (cancelled) return;
      console.log("[SSE] connect start", { run_id });
      setStatus("connecting");
      setReason("unknown");
      let ticket: string | undefined;

      // Always fetch a new ticket on every connect attempt (tickets are single-use)
      try {
        const { ticket: fetched } = await request<{ ticket: string }>(
          `/workflows/${encodeURIComponent(run_id)}/stream-ticket`,
          { method: "POST" },
        );
        ticket = fetched;
        console.log("[SSE] ticket fetched", { run_id, hasTicket: !!ticket });
      } catch (err) {
        console.log("[SSE] ticket fetch failed", { err });
        // A 404 means the run_id is genuinely unknown (e.g. a stale persisted
        // id), so retrying 5x with backoff would waste ~30s and never recover.
        // Report it distinctly and let a higher layer re-mint a fresh run.
        if (err instanceof ApiError && err.status === 404) {
          setReason("unknown-run");
          setStatus("error");
          return;
        }
        // Transient network / 5xx errors go through the normal reconnect budget.
        scheduleReconnect();
        return;
      }
      if (cancelled || !ticket) return;

      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
      // Resume from the last applied seq so the server doesn't replay history
      // (the backend supports Last-Event-ID resume). Omitted on a fresh connect.
      const lastId = lastSeqRef.current
        ? `&Last-Event-ID=${encodeURIComponent(String(lastSeqRef.current))}`
        : "";
      console.log("[SSE] creating EventSource", {
        run_id,
        url: `${apiBase}/api/workflows/${encodeURIComponent(run_id)}/events?ticket=...${lastId ? "&Last-Event-ID=..." : ""}`,
      });
      const nextSource = new EventSource(
        `${apiBase}/api/workflows/${encodeURIComponent(run_id)}/events?ticket=${encodeURIComponent(ticket)}${lastId}`,
      );
      source = nextSource;
      sourceRef.current = nextSource;

      nextSource.onopen = () => {
        console.log("[SSE] onopen - connection established", { run_id });
        reconnectAttempts = 0;
        setReason("unknown");
        setStatus("live");
      };
      nextSource.onmessage = (e) => {
        console.log("[SSE] onmessage", { data: e.data });
        apply(JSON.parse(e.data) as StreamEvent);
      };
      for (const t of EVENT_TYPES) {
        nextSource.addEventListener(t, (e) => {
          console.log("[SSE] eventListener", {
            type: t,
            data: (e as MessageEvent).data,
          });
          apply(JSON.parse((e as MessageEvent).data) as StreamEvent);
        });
      }
      nextSource.onerror = (err) => {
        console.log("[SSE] onerror", {
          err,
          readyState: nextSource.readyState,
          doneRef: doneRef.current,
        });
        // After a terminal workflow_result the server closes the stream
        // deliberately; don't treat that as a connection failure.
        if (doneRef.current) return;
        closeSource();
        scheduleReconnect();
      };
    };

    void connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      closeSource();
    };
  }, [run_id, apply, options?.ticket, options?.nonce]);

  return { status, events, nodeStates, text, reason };
}
