"use client";
import { useStepGuard } from "@/lib/onboarding/use-step-guard";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { InitializationProgress } from "@/components/onboarding/initialization-progress";
import { InitializationError } from "@/components/onboarding/initialization-error";
import {
  startInitialize,
  retryInitialize,
  getInitializeStatus,
} from "@/api/onboarding";
import { useWorkflowEvents } from "@/hooks/use-workflow-events";
import type { StageConfig } from "@/lib/onboarding/types";

export interface StageInfo {
  stage: string;
  status: "started" | "completed";
  ts: string;
  stats?: Record<string, number>;
}

export interface SyncProgress {
  document_count: number;
  chunk_count: number;
}

export interface StageToolProgress {
  name: "documentation_sync" | "knowledge_extraction" | "initial_evaluation";
  document_count?: number;
  chunk_count?: number;
  processed?: number;
  total?: number;
  knowledge_count?: number;
  relationship_count?: number;
}

export interface PerStageProgress {
  documentation_sync?: SyncProgress;
  knowledge_extraction?: {
    processed: number;
    total: number;
    knowledge_count?: number;
    relationship_count?: number;
  };
  initial_evaluation?: { processed: number; total: number };
}

// Lifecycle keepalive stage published by the backend (initialize.py) so the SSE
// connection receives a frame before the first real stage starts. It has no
// "completed" counterpart and is not a manifest stage, so it must never be
// tracked as a task — otherwise "last started without a completed" would select
// it during gaps between running stages and render a phantom active row.
const LIFECYCLE_STAGES = new Set<string>(["initialization_started"]);

// Duration-heuristic weights driving the overall progress bar (fallback until
// the backend's authoritative overall_progress events arrive). Sums to 1.0.
// Adjust these to reflect the relative wall-clock cost of each manifest stage.
const STAGE_WEIGHTS: Record<string, number> = {
  repository_ingestion: 0.35,
  knowledge_construction: 0.35,
  initial_evaluation: 0.15,
  health_report: 0.075,
  recommendations: 0.075,
};

export default function InitializePage() {
  useStepGuard("initialize");
  const router = useRouter();
  const [run_id, setRun_id] = useState<string | null>(null);
  const [ticket, setTicket] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [isFailed, setIsFailed] = useState(false);
  const [failure, setFailure] = useState<{
    step: string;
    detail: string;
  } | null>(null);
  const [finalStats, setFinalStats] = useState<{
    document_count?: number;
    chunk_count?: number;
  } | null>(null);
  const [stageManifest, setStageManifest] = useState<StageConfig[]>([]);
  const [stageProgress, setStageProgress] = useState<Record<string, number>>(
    {},
  );
  // Authoritative aggregate from the backend's overall_progress events; null
  // until the first one arrives (the memo fallback covers that window).
  const [streamOverall, setStreamOverall] = useState<number | null>(null);
  // Tracks whether we already re-minted a fresh run for a dead (unknown) run_id
  // to avoid an infinite re-mint loop if the fresh run also fails to resolve.
  const hasRemintedRef = useRef(false);
  // Bumped to force the stream hook to reconnect even when run_id is unchanged
  // (the resumed path returns the same run_id, whose jobs row is now reconciled
  // server-side by Task 2, so reconnecting lets stream-ticket resolve).
  const [reconnectNonce, setReconnectNonce] = useState(0);

  const { status, events, reason } = useWorkflowEvents(run_id, {
    ticket: ticket ?? undefined,
    nonce: reconnectNonce,
  });

  // Parse stage_change events into structured StageInfo[]
  const stageHistory = useMemo(() => {
    const history: StageInfo[] = [];
    for (const event of events) {
      if (event.type === "stage_change") {
        const stage = event.payload.stage as string;
        const eventStatus = event.payload.status as "started" | "completed";
        if (stage && eventStatus && !LIFECYCLE_STAGES.has(stage)) {
          history.push({
            stage,
            status: eventStatus,
            ts: event.ts,
            stats: event.payload.stats as Record<string, number> | undefined,
          });
        }
      }
    }
    return history;
  }, [events]);

  // Parse tool_progress events for intermediate sync stats per stage
  const perStageProgress = useMemo((): PerStageProgress => {
    const progress: PerStageProgress = {};
    for (const event of events) {
      if (event.type === "tool_progress" && event.payload.name) {
        const name = event.payload.name as string;
        if (name === "documentation_sync") {
          progress.documentation_sync = {
            document_count: (event.payload.document_count as number) ?? 0,
            chunk_count: (event.payload.chunk_count as number) ?? 0,
          };
        } else if (name === "knowledge_extraction") {
          progress.knowledge_extraction = {
            processed: (event.payload.processed as number) ?? 0,
            total: (event.payload.total as number) ?? 0,
            knowledge_count:
              (event.payload.knowledge_count as number) ?? undefined,
            relationship_count:
              (event.payload.relationship_count as number) ?? undefined,
          };
        } else if (name === "initial_evaluation") {
          progress.initial_evaluation = {
            processed: (event.payload.processed as number) ?? 0,
            total: (event.payload.total as number) ?? 0,
          };
        }
      }
    }
    return progress;
  }, [events]);

  // Backward-compatible syncProgress for existing components
  const syncProgress = useMemo((): SyncProgress | null => {
    return perStageProgress.documentation_sync ?? null;
  }, [perStageProgress]);

  // Current active stage (last "started" without a matching "completed")
  const activeStage = useMemo(() => {
    const stageMap = new Map<string, StageInfo>();
    for (const info of stageHistory) {
      stageMap.set(info.stage, info);
    }
    // Find the last started stage that hasn't been completed
    for (let i = stageHistory.length - 1; i >= 0; i--) {
      const info = stageHistory[i];
      if (info.status === "started") {
        const completed = stageMap.get(info.stage);
        if (completed?.status !== "completed") {
          return info;
        }
      }
    }
    return null;
  }, [stageHistory]);

  // Overall progress (0-100): weighted sum over the manifest stages. This is
  // the fallback used only until the backend's authoritative overall_progress
  // event arrives. The lifecycle sentinel is excluded automatically (absent
  // from the manifest and from stageHistory). A stage contributes 100 once its
  // stage_change "completed" arrives, otherwise its latest stage_progress
  // value, otherwise 0.
  const overallMemo = useMemo(() => {
    if (stageManifest.length === 0) return 0;
    const completed = new Set(
      stageHistory
        .filter((info) => info.status === "completed")
        .map((info) => info.stage),
    );
    let total = 0;
    for (const stage of stageManifest) {
      const weight = STAGE_WEIGHTS[stage.id] ?? 0;
      const pct = completed.has(stage.id)
        ? 100
        : (stageProgress[stage.id] ?? 0);
      total += weight * pct;
    }
    return Math.round(total);
  }, [stageManifest, stageHistory, stageProgress]);

  // Authoritative aggregate from the backend; the memo fallback only covers
  // the window before the first overall_progress event arrives.
  const overallProgress = streamOverall ?? overallMemo;

  // {at, value} samples of the effective overall %, fed to the ETA hint.
  // Deduped against the last sampled value and capped to the last 40. Refs are
  // only touched inside the effect (React Compiler-safe), so the timeline is
  // always one event behind the rendered % — fine for an approximate ETA.
  const [overallTimeline, setOverallTimeline] = useState<
    { at: number; value: number }[]
  >([]);
  const lastOverallRef = useRef<number | null>(null);
  useEffect(() => {
    if (lastOverallRef.current === overallProgress) return;
    lastOverallRef.current = overallProgress;
    const at = Date.now();
    const value = overallProgress;
    setOverallTimeline((prev) => [...prev, { at, value }].slice(-40));
  }, [overallProgress]);

  useEffect(() => {
    void (async () => {
      await Promise.resolve();
      for (const event of events) {
        if (event.type === "workflow_result") {
          if (event.payload.status === "COMPLETED") {
            setFinalStats({
              document_count: event.payload.document_count as
                | number
                | undefined,
              chunk_count: event.payload.chunk_count as number | undefined,
            });
            router.push("/onboarding/complete");
          } else {
            setIsFailed(true);
            setFailure({
              step: "initialize",
              detail: String(event.payload.error ?? "Initialization failed"),
            });
          }
        }
      }
    })();
  }, [events, router]);

  useEffect(() => {
    void (async () => {
      await Promise.resolve();
      for (const event of events) {
        if (event.type === "stage_manifest") {
          const stages = event.payload.stages as StageConfig[];
          if (Array.isArray(stages)) {
            setStageManifest(stages);
          }
        }
        if (event.type === "stage_progress") {
          const stage = event.payload.stage as string;
          const progress = event.payload.progress as number;
          if (stage && typeof progress === "number") {
            setStageProgress((prev) => ({ ...prev, [stage]: progress }));
          }
        }
        if (event.type === "overall_progress") {
          const progress = event.payload.progress as number;
          if (typeof progress === "number") {
            setStreamOverall(progress);
          }
        }
      }
    })();
  }, [events]);

  useEffect(() => {
    if (run_id) return;
    let cancelled = false;
    (async () => {
      try {
        const status = await getInitializeStatus();
        if (status.state === "INITIALIZING" && status.run_id) {
          setRun_id(status.run_id);
          // Seed the stage manifest immediately so the progress UI is correct
          // even before the first SSE stage_manifest event arrives (avoiding a
          // window where the active stage has no mapped row). Best-effort.
          if (Array.isArray(status.stage_config) && status.stage_config.length) {
            setStageManifest(status.stage_config);
          }
          return;
        }
        // Terminal states must not auto-start (the backend rejects them with
        // 409, which would surface as a false "Initialization Failed" banner).
        if (status.state === "COMPLETED") {
          if (!cancelled) router.replace("/onboarding/complete");
          return;
        }
        if (status.state === "FAILED") {
          if (!cancelled) {
            setFailure({
              step: "initialize",
              detail: status.failure?.detail ?? "Initialization failed",
            });
            setIsFailed(true);
          }
          return;
        }
        const res = await startInitialize();
        if (res.run_id) {
          setRun_id(res.run_id);
          if (res.ticket) setTicket(res.ticket);
        } else {
          setStartError("Initialization did not start.");
        }
      } catch {
        if (!cancelled) setStartError("We couldn't start initialization.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [run_id, router]);

  // When the stream reports a genuinely unknown run_id (stream-ticket 404,
  // e.g. a stale persisted id with no backend jobs row), the reconnect budget
  // can never succeed for a dead run. Mint a fresh run + ticket exactly once so
  // live progress can reconnect. The bumped nonce forces the hook to reconnect
  // even when the resumed path returns the same run_id (whose jobs row Task 2
  // has now reconciled), so stream-ticket can resolve. If the re-mint itself
  // fails, surface the start error; if it resolves but the run is still
  // unresolvable, the render-time `staleUnknown` derivation below surfaces the
  // retry UI rather than stranding on the banner.
  useEffect(() => {
    if (reason !== "unknown-run" || !run_id || hasRemintedRef.current) return;
    hasRemintedRef.current = true;
    void (async () => {
      try {
        const res = await startInitialize();
        if (res.run_id) setRun_id(res.run_id);
        if (res.ticket) setTicket(res.ticket);
        // Even on a successful re-mint, force the hook to reconnect (bump the
        // nonce) so stream-ticket can re-resolve — critical when the resumed
        // path returns the SAME run_id with no ticket. If the run is still
        // unknown after reconnecting, the render-time `staleUnknown` derivation
        // surfaces the retry UI instead of stranding on the banner.
        setReconnectNonce((n) => n + 1);
      } catch {
        try {
          const s = await getInitializeStatus();
          if (s.state === "COMPLETED") {
            router.push("/onboarding/complete");
          } else if (s.state === "FAILED") {
            setIsFailed(true);
            setFailure({
              step: "initialize",
              detail: s.failure?.detail ?? "Initialization failed",
            });
          } else {
            setStartError("We couldn't start your initialization. Please retry.");
          }
        } catch {
          setStartError("We couldn't start your initialization. Please retry.");
        }
        setReconnectNonce((n) => n + 1);
      }
    })();
  }, [reason, run_id]);

  // After a re-mint + forced reconnect (nonce > 0), a still-unknown run means
  // recovery failed. Surface the retry UI instead of an endless "checking
  // status" banner.
  const staleUnknown = reconnectNonce > 0 && reason === "unknown-run";

  // An exhausted SSE reconnect budget does NOT mean the run failed — the
  // workflow may still be running (or may have already completed) server-side.
  // Show a neutral "checking status" notice while the poll below resolves the
  // real terminal state, rather than a false "Initialization Failed" banner.
  const connectionLost =
    status === "error" && !isFailed && !startError && !staleUnknown;

  // When SSE exhausts its reconnect budget, fall back to polling the saved
  // run so a surviving worker can still deliver a terminal outcome.
  useEffect(() => {
    if (status !== "error" || !run_id || reason === "unknown-run") return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const poll = async () => {
      try {
        const s = await getInitializeStatus();
        if (cancelled) return;
        if (s.state === "COMPLETED") {
          router.push("/onboarding/complete");
          return;
        }
        if (s.state === "FAILED") {
          setIsFailed(true);
          setFailure({
            step: "initialize",
            detail: s.failure?.detail ?? "Initialization failed",
          });
          return;
        }
        // For INITIALIZING or other states, just retry polling
      } catch {
        // Transient polling errors are retried below.
      }
      timer = setTimeout(poll, 5_000);
    };
    // Longer initial delay to allow backend state to propagate
    timer = setTimeout(poll, 3_000);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [status, run_id, reason, router]);

  async function handleRetry() {
    setStartError(null);
    setIsFailed(false);
    setFailure(null);
    setRun_id(null);
    setTicket(null);
    setFinalStats(null);
    hasRemintedRef.current = false;
    setReconnectNonce((n) => n + 1);
    try {
      const res = await retryInitialize();
      if (res.run_id) setRun_id(res.run_id);
      if (res.ticket) setTicket(res.ticket);
    } catch {
      setStartError("Retry failed. Please try again.");
    }
  }

  return (
    <OnboardingShell currentStep="initialize">
      <h1 className="mb-[11px] mt-[clamp(24px,4vh,48px)] text-[clamp(24px,3.2vh,32px)] font-bold leading-[1.2] tracking-[-1.2px] text-[#101a43]">
        Initializing Draftly
      </h1>
      <p className="mb-[clamp(8px,1.8vh,24px)] text-[15px] leading-[1.55] text-[#53648e]">
        We&apos;re analyzing your repository and building the knowledge
        <br /> foundation. This may take a few minutes.
      </p>
      <div className="mt-6">
        {isFailed || startError || staleUnknown ? (
          <InitializationError
            failure={
              failure ??
              (startError
                ? { step: "initialize", detail: startError }
                : {
                    step: "initialize",
                    detail: "Lost contact with the server.",
                  })
            }
            onRetry={() => void handleRetry()}
          />
        ) : (
          <>
            {connectionLost && (
              <div
                role="status"
                className="mb-4 flex max-w-[640px] items-center gap-2 rounded-[9px] border border-amber-200 bg-amber-50 p-[15px] text-xs text-amber-700">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />
                <span>
                  Connection lost — checking your initialization status…
                </span>
              </div>
            )}
            <InitializationProgress
              stageHistory={stageHistory}
              activeStage={activeStage}
              syncProgress={syncProgress}
              finalStats={finalStats}
              stageManifest={stageManifest}
              stageProgress={stageProgress}
              perStageProgress={perStageProgress}
              overallProgress={overallProgress}
              overallTimeline={overallTimeline}
            />
          </>
        )}
      </div>
    </OnboardingShell>
  );
}
