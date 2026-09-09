"use client";
import {
  Check,
  Code2,
  FileCode2,
  Layers,
  ShieldCheck,
  Sparkles,
  ListTodo,
} from "lucide-react";
import {
  GithubIcon,
  SlackGlyph,
  DiscordGlyph,
} from "@/components/onboarding/design/glyphs";
import { BrandMark } from "@/components/onboarding/design/brand-mark";
import { cn } from "@/lib/utils";
import type {
  StageInfo,
  SyncProgress,
  PerStageProgress,
} from "@/app/(onboarding)/onboarding/initialize/page";
import type { StageConfig } from "@/lib/onboarding/types";

/* ------------------------------------------------------------------ */
/* Task definitions — maps backend stages to design's initTasks       */
/* ------------------------------------------------------------------ */

interface InitTask {
  key: string;
  label: string;
  backendStage?: string; // maps to StageInfo.stage
}

function buildInitTasks(manifest: StageConfig[]): InitTask[] {
  return [...manifest]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ key: s.id, label: s.label, backendStage: s.id }));
}

/* ------------------------------------------------------------------ */
/* Relative time formatter                                            */
/* ------------------------------------------------------------------ */

export function estimateRemainingSeconds(
  first: { at: number; value: number },
  last: { at: number; value: number },
  now = Number.POSITIVE_INFINITY,
): number | null {
  const dt = last.at - first.at;
  const dv = last.value - first.value;
  if (dt <= 0 || dv <= 0) return null; // no slope yet / moved backwards
  const remainingMs = (100 - last.value) / (dv / dt);
  if (!Number.isFinite(remainingMs) || remainingMs <= 0) return null;
  if (Number.isFinite(now) && last.at + remainingMs <= now) return null;
  return Math.round(remainingMs / 1000);
}

function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}m ${rest}s`;
}

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 5_000) return "Just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

// Single source of truth mapping each backend stage to the tool whose
// progress feeds it. If a stage/tool is renamed, only this map changes.
const STAGE_TO_TOOL: Record<string, keyof PerStageProgress> = {
  repository_ingestion: "documentation_sync",
  knowledge_construction: "knowledge_extraction",
  initial_evaluation: "initial_evaluation",
};

// Stages whose task-bar % is derived from a tool_progress counter (processed/
// total) rather than the coarse, banded stage_progress events (10/95/100).
const STAGE_COUNTER: Record<string, "knowledge_extraction" | "initial_evaluation"> = {
  knowledge_construction: "knowledge_extraction",
  initial_evaluation: "initial_evaluation",
};

function stagePercent(
  stage: string | undefined,
  perStageProgress: PerStageProgress,
): number | null {
  const tool = stage ? STAGE_COUNTER[stage] : undefined;
  if (!tool) return null;
  const counter = perStageProgress[tool];
  if (!counter || counter.total <= 0) return null;
  return Math.round((counter.processed / counter.total) * 100);
}

/* ------------------------------------------------------------------ */
/* Right-column visualization (architecture diagram + stats)          */
/* ------------------------------------------------------------------ */

function KnowledgeGraphViz() {
  return (
    <div className="relative mx-auto my-1 mb-2 mt-1 grid h-[250px] place-items-center">
      <div className="relative h-full w-[280px]">
        <svg
          className="absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 280 250"
          preserveAspectRatio="none"
          fill="none">
          <path
            d="M140 48 V84"
            stroke="#c2d0e8"
            strokeWidth="1"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M39 88 V112 H108"
            stroke="#c2d0e8"
            strokeWidth="1"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M241 88 V112 H172"
            stroke="#c2d0e8"
            strokeWidth="1"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M140 185 V202"
            stroke="#c2d0e8"
            strokeWidth="1"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute left-4 top-10 z-[2] grid size-[46px] place-items-center rounded-[11px] border border-[#e2e8f4] bg-surface text-foreground shadow-[0_5px_14px_#7d9de022]">
          <GithubIcon size={22} />
        </div>
        <div className="absolute left-[117px] top-0 z-[2] grid size-[46px] place-items-center rounded-[11px] border border-[#e2e8f4] bg-surface text-foreground shadow-[0_5px_14px_#7d9de022]">
          <SlackGlyph size={22} />
        </div>
        <div className="absolute right-4 top-10 z-[2] grid size-[46px] place-items-center rounded-[11px] border border-[#e2e8f4] bg-surface text-foreground shadow-[0_5px_14px_#7d9de022]">
          <DiscordGlyph size={22} />
        </div>
        <div className="absolute left-1/2 top-[74px] z-[1] w-[150px] -translate-x-1/2">
          <svg
            viewBox="0 0 150 110"
            fill="none"
            className="block h-auto w-full">
            <path d="M75 57 L145 72 L75 87 L5 72 Z" fill="#93a5f4" />
            <path d="M5 72 L75 87 L75 109 L5 94 Z" fill="#6f84ec" />
            <path d="M145 72 L75 87 L75 109 L145 94 Z" fill="#5d74e5" />
            <circle cx="28" cy="88" r="2" fill="#dfe7ff" />
            <circle cx="40" cy="91" r="2" fill="#dfe7ff" />
            <circle cx="52" cy="93" r="2" fill="#dfe7ff" />
            <circle cx="64" cy="96" r="2" fill="#dfe7ff" />
            <path d="M75 37 L145 52 L75 67 L5 52 Z" fill="#b9c6f8" />
            <path d="M5 52 L75 67 L75 83 L5 68 Z" fill="#9dadf4" />
            <path d="M145 52 L75 67 L75 83 L145 68 Z" fill="#8b9df1" />
            <path d="M75 17 L145 32 L75 47 L5 32 Z" fill="#e3e9ff" />
            <path d="M5 32 L75 47 L75 63 L5 48 Z" fill="#c6d2fb" />
            <path d="M145 32 L75 47 L75 63 L145 48 Z" fill="#b3c1f8" />
          </svg>
          <span className="absolute left-1/2 top-[29%] grid -translate-x-1/2 -translate-y-1/2 place-items-center">
            <BrandMark size={26} />
          </span>
        </div>
        <div className="absolute bottom-0 left-[117px] z-[2] grid size-[46px] place-items-center rounded-[11px] border border-[#e2e8f4] bg-surface text-foreground shadow-[0_5px_14px_#7d9de022]">
          <FileCode2 size={20} />
        </div>
        <span className="pointer-events-none absolute left-[88%] top-[10%] text-[10px] text-[#b0c4f0]">
          &#10022;
        </span>
        <span className="pointer-events-none absolute left-[2%] top-[36%] text-[10px] text-[#b0c4f0]">
          &#10022;
        </span>
        <span className="pointer-events-none absolute bottom-[32%] right-[4%] text-[8px] text-[#b0c4f0] opacity-70">
          &#10022;
        </span>
      </div>
    </div>
  );
}

function StatsPanel({
  perStageProgress,
  finalStats,
  activeStage,
}: {
  perStageProgress: PerStageProgress;
  finalStats: { document_count?: number; chunk_count?: number } | null;
  activeStage: StageInfo | null;
}) {
  const stage = activeStage?.stage;

  const tool = stage ? STAGE_TO_TOOL[stage] : undefined;
  const toolProgress = tool ? perStageProgress[tool] : undefined;

  if (stage === "repository_ingestion") {
    const sync = toolProgress as
      | PerStageProgress["documentation_sync"]
      | undefined;
    const docs = finalStats?.document_count ?? sync?.document_count ?? null;
    const chunks = finalStats?.chunk_count ?? sync?.chunk_count ?? null;

    return (
      <div className="flex gap-2">
        <StatTile
          tone="bg-[#f1eaff]"
          icon={<FileCode2 size={13} className="text-[#7042e9]" />}
          value={docs !== null ? String(docs) : "\u2014"}
          label="Documents"
        />
        <StatTile
          tone="bg-[#eaf1ff]"
          icon={<Code2 size={13} className="text-[#1260ed]" />}
          value={
            chunks !== null
              ? chunks >= 1000
                ? `${(chunks / 1000).toFixed(1)}k`
                : String(chunks)
              : "\u2014"
          }
          label="Chunks"
        />
        <StatTile
          tone="bg-[#fef3e8]"
          icon={<Layers size={13} className="text-[#e8742a]" />}
          value={
            docs !== null
              ? String(Math.max(1, Math.round(docs * 0.4)))
              : "\u2014"
          }
          label="Connections"
        />
        <StatTile
          tone="bg-[#f1f4f8]"
          icon={<ShieldCheck size={13} className="text-[#8a97b0]" />}
          value={docs !== null ? "Healthy" : "\u2014"}
          label="Health"
          muted={docs === null}
        />
      </div>
    );
  }

  if (stage === "knowledge_construction") {
    const kc = toolProgress as
      | PerStageProgress["knowledge_extraction"]
      | undefined;
    const processed = kc?.processed ?? 0;
    const total = kc?.total ?? 0;
    const pct = total > 0 ? Math.round((processed / total) * 100) : 0;
    const facts = kc?.knowledge_count;
    const relationships = kc?.relationship_count;
    const hasCounts = facts !== undefined || relationships !== undefined;

    return (
      <div className="flex gap-2">
        <StatTile
          tone="bg-[#f1eaff]"
          icon={<ListTodo size={13} className="text-[#7042e9]" />}
          value={total > 0 ? `${processed}/${total}` : "\u2014"}
          label="Chunks Processed"
        />
        <StatTile
          tone="bg-[#eaf1ff]"
          icon={<Code2 size={13} className="text-[#1260ed]" />}
          value={`${pct}%`}
          label="Progress"
        />
        <StatTile
          tone="bg-[#fef3e8]"
          icon={<Layers size={13} className="text-[#e8742a]" />}
          value={facts !== undefined ? String(facts) : "\u2014"}
          label="Facts Extracted"
          muted={!hasCounts}
        />
        <StatTile
          tone="bg-[#f1f4f8]"
          icon={<ShieldCheck size={13} className="text-[#8a97b0]" />}
          value={relationships !== undefined ? String(relationships) : "\u2014"}
          label="Relationships"
          muted={!hasCounts}
        />
      </div>
    );
  }

  if (stage === "initial_evaluation") {
    const ie = toolProgress as
      | PerStageProgress["initial_evaluation"]
      | undefined;
    const processed = ie?.processed ?? 0;
    const total = ie?.total ?? 0;
    const pct = total > 0 ? Math.round((processed / total) * 100) : 0;

    return (
      <div className="flex gap-2">
        <StatTile
          tone="bg-[#f1eaff]"
          icon={<FileCode2 size={13} className="text-[#7042e9]" />}
          value={total > 0 ? `${processed}/${total}` : "\u2014"}
          label="Docs Evaluated"
        />
        <StatTile
          tone="bg-[#eaf1ff]"
          icon={<Code2 size={13} className="text-[#1260ed]" />}
          value={`${pct}%`}
          label="Progress"
        />
        <StatTile
          tone="bg-[#fef3e8]"
          icon={<Layers size={13} className="text-[#e8742a]" />}
          value="\u2014"
          label="Avg Score"
          muted
        />
        <StatTile
          tone="bg-[#f1f4f8]"
          icon={<ShieldCheck size={13} className="text-[#8a97b0]" />}
          value="\u2014"
          label="Coverage"
          muted
        />
      </div>
    );
  }

  // Default/other stages
  const sync = perStageProgress.documentation_sync;
  const docs = finalStats?.document_count ?? sync?.document_count ?? null;
  const chunks = finalStats?.chunk_count ?? sync?.chunk_count ?? null;

  return (
    <div className="flex gap-2">
      <StatTile
        tone="bg-[#f1eaff]"
        icon={<FileCode2 size={13} className="text-[#7042e9]" />}
        value={docs !== null ? String(docs) : "\u2014"}
        label="Documents"
      />
      <StatTile
        tone="bg-[#eaf1ff]"
        icon={<Code2 size={13} className="text-[#1260ed]" />}
        value={
          chunks !== null
            ? chunks >= 1000
              ? `${(chunks / 1000).toFixed(1)}k`
              : String(chunks)
            : "\u2014"
        }
        label="Chunks"
      />
      <StatTile
        tone="bg-[#fef3e8]"
        icon={<Layers size={13} className="text-[#e8742a]" />}
        value={
          docs !== null ? String(Math.max(1, Math.round(docs * 0.4))) : "\u2014"
        }
        label="Connections"
      />
      <StatTile
        tone="bg-[#f1f4f8]"
        icon={<ShieldCheck size={13} className="text-[#8a97b0]" />}
        value={docs !== null ? "Healthy" : "\u2014"}
        label="Health"
        muted={docs === null}
      />
    </div>
  );
}

function StatTile({
  tone,
  icon,
  value,
  label,
  muted = false,
}: {
  tone: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex-1 rounded-[9px] p-2.5 text-left text-[10px]",
        muted ? "text-[#8a97b0]" : "text-[#4a5a80]",
        tone,
      )}>
      <i className="mb-2 grid size-[22px] place-items-center rounded-md bg-white not-italic">
        {icon}
      </i>
      <b
        className={cn(
          "mb-[3px] block text-[17px]",
          muted ? "text-[#6b7a9c]" : "text-[#101a43]",
        )}>
        {value}
      </b>
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                    */
/* ------------------------------------------------------------------ */

export function InitializationProgress({
  stageHistory,
  activeStage,
  syncProgress,
  finalStats,
  stageManifest,
  stageProgress,
  perStageProgress,
  overallProgress,
  overallTimeline,
}: {
  stageHistory: StageInfo[];
  activeStage: StageInfo | null;
  syncProgress: SyncProgress | null;
  finalStats: { document_count?: number; chunk_count?: number } | null;
  stageManifest: StageConfig[];
  stageProgress: Record<string, number>;
  perStageProgress: PerStageProgress;
  overallProgress?: number;
  overallTimeline?: { at: number; value: number }[];
}) {
  // Build a lookup of completed stages
  const completedStages = new Set<string>();
  const startedStages = new Map<string, string>(); // stage → ts
  for (const info of stageHistory) {
    if (info.status === "completed") completedStages.add(info.stage);
    if (info.status === "started") startedStages.set(info.stage, info.ts);
  }

  // Build task list from manifest (dynamic) or fallback to preset-only
  const initTasks = buildInitTasks(stageManifest);

  // Determine which task index is active
  let activeTaskIndex = activeStage
    ? initTasks.findIndex((t) => t.backendStage === activeStage.stage)
    : -1;

  // Resume race guard: when events replay before the stage_manifest arrives,
  // the running stage may not be in `initTasks` yet. Fall back to a display
  // task derived from the active stage so its row + progress bar still render.
  const effectiveTasks =
    activeTaskIndex === -1 && activeStage
      ? [
          ...initTasks,
          {
            key: activeStage.stage,
            label: activeStage.stage,
            backendStage: activeStage.stage,
          },
        ]
      : initTasks;
  if (activeTaskIndex === -1 && activeStage) {
    activeTaskIndex = effectiveTasks.length - 1;
  }

  const stageId = activeStage?.stage;
  const counterPct = stagePercent(stageId, perStageProgress);
  const isCounterStage = stageId ? STAGE_COUNTER[stageId] !== undefined : false;
  // The stage % comes from the tool_progress counter (knowledge_construction,
  // initial_evaluation) so the left bar matches the stats tile instead of the
  // coarse banded 10/95/100 stage_progress values. Other stages fall back to
  // their stage_progress value.
  const progress = isCounterStage
    ? (counterPct ?? 0)
    : stageId
      ? (stageProgress[stageId] ?? 0)
      : 0;
  // Active but no percentage reported yet -> show an indeterminate bar instead
  // of a dead 0%.
  const hasProgress = isCounterStage
    ? counterPct !== null
    : stageId
      ? stageProgress[stageId] !== undefined
      : false;

  // ETA extrapolated from the overall-slope samples (first vs latest point).
  const remaining = (() => {
    if (!overallTimeline || overallTimeline.length < 2) return null;
    const first = overallTimeline[0];
    const last = overallTimeline[overallTimeline.length - 1];
    return estimateRemainingSeconds(first, last);
  })();

  return (
    <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(260px,0.8fr)] gap-[35px] max-[900px]:grid-cols-1">
      {/* Left column — task list */}
      <div className="rounded-xl border border-[#d9e1f0] bg-white px-[25px] py-[17px]">
        {overallProgress !== undefined && (
          <div className="mb-2 border-b border-[#eef2f9] pb-3 pt-1">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={overallProgress}
              className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#101a43]">
                Overall progress
              </span>
              <b className="tabular-nums text-[#52407a]">{overallProgress}%</b>
            </div>
            <i className="relative block h-1.5 flex-1 overflow-hidden rounded-[4px] bg-[#e6ddff] not-italic">
              <span
                className="absolute inset-y-0 left-0 rounded-[4px] bg-[#8a67ee] transition-[width] duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </i>
            {remaining !== null && overallProgress < 100 && (
              <p className="mt-1 text-[11px] text-[#6b7294]">
                ≈ {formatDuration(remaining)} left
              </p>
            )}
          </div>
        )}
        {effectiveTasks.length === 0 ? (
          <div
            role="status"
            aria-label="Loading workspace state"
            className="space-y-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[30px_1fr_auto] items-center gap-x-3 py-[11px]">
                <div className="draftly-skeleton mx-auto size-[18px]" />
                <div className="draftly-skeleton h-4 w-2/3 max-w-[220px]" />
              </div>
            ))}
          </div>
        ) : (
          effectiveTasks.map((task, i) => {
          const isBackendDone = task.backendStage
            ? completedStages.has(task.backendStage)
            : false;
          const done = isBackendDone;
          const active = !done && activeTaskIndex === i;

          return (
            <TaskRow
              key={task.key}
              label={task.label}
              done={done}
              active={active}
              progress={active ? progress : 0}
              indeterminate={active && !hasProgress}
              activeStageId={active ? activeStage?.stage : undefined}
              relativeTs={
                task.backendStage && completedStages.has(task.backendStage)
                  ? relativeTime(startedStages.get(task.backendStage) ?? "")
                  : undefined
              }
              showSubdetail={task.backendStage === "repository_ingestion"}
              subdetail={
                syncProgress
                  ? `${syncProgress.document_count} files processed`
                  : undefined
              }
            />
          );
        })
        )}
      </div>

      {/* Right column — visualization + stats */}
      <div className="rounded-xl border border-[#d9e1f0] bg-white p-5 text-center">
        <h3 className="mb-1 flex items-center gap-2 text-left text-base">
          <Sparkles size={16} className="text-[#7042e9]" /> What Draftly is
          doing
        </h3>
        <KnowledgeGraphViz />
        <h3 className="mb-4 text-base">
          Creating your project knowledge graph
        </h3>
        <p className="mb-4 text-xs leading-[1.6] text-[#53648e]">
          We connect code, docs, issues, and conversations to understand how
          your product works and evolves.
        </p>
        <StatsPanel
          perStageProgress={perStageProgress}
          finalStats={finalStats}
          activeStage={activeStage}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Individual task row                                               */
/* ------------------------------------------------------------------ */

function TaskRow({
  label,
  done,
  active,
  progress,
  indeterminate,
  activeStageId,
  relativeTs,
  showSubdetail,
  subdetail,
}: {
  label: string;
  done: boolean;
  active: boolean;
  progress: number;
  indeterminate?: boolean;
  activeStageId?: string;
  relativeTs?: string;
  showSubdetail?: boolean;
  subdetail?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid items-center gap-x-3 gap-y-1 py-[11px] text-[13px]",
        active ? "grid-cols-[30px_1fr_auto]" : "grid-cols-[30px_1fr_auto]",
        "max-[560px]:grid-cols-[24px_1fr]",
      )}>
      {/* Status indicator */}
      <span
        className={cn(
          done &&
            "grid size-[22px] place-items-center justify-self-center rounded-full bg-[#32a86d] text-white",
          active &&
            "mx-auto size-[18px] animate-spin rounded-full border-2 border-dotted border-[#814ef0]",
          !done && !active && "size-3.5 rounded-full border border-[#bdcbe0]",
        )}>
        {done && <Check size={13} />}
      </span>

      {/* Label */}
      <b
        className={cn(
          done
            ? "text-[#101a43]"
            : active
              ? "text-[#101a43]"
              : "font-semibold text-[#51628d]",
        )}>
        {label}
        {showSubdetail && subdetail && (
          <small className="mt-1 block text-[11px] font-normal text-[#53648e]">
            {subdetail}
          </small>
        )}
      </b>

      {/* Status text */}
      <em
        className={cn(
          "not-italic text-[11px] max-[560px]:col-start-2",
          done && "text-[#32a86d]",
          active && "font-semibold text-[#7142ed]",
          !done && !active && "text-[#8a97b0]",
        )}>
        {done ? "Completed" : active ? "In progress" : "Pending"}
      </em>

      {/* Relative timestamp */}
      {relativeTs && !active && (
        <time className="min-w-[72px] text-right text-[11px] tabular-nums text-[#8a97b0] max-[560px]:hidden">
          {relativeTs}
        </time>
      )}

      {/* Progress bar (active task only) */}
      {active && (
        <>
          <div className="col-start-2 col-end-[-1] mt-0.5 flex items-center gap-2.5">
            <i className="relative block h-1.5 flex-1 overflow-hidden rounded-[4px] bg-[#e6ddff] not-italic">
              {indeterminate ? (
                <span
                  className="animate-indeterminate absolute inset-y-0 w-1/3 rounded-[4px] bg-[#8a67ee]/60"
                  aria-label="working"
                />
              ) : (
                <span
                  key={activeStageId}
                  data-stage={activeStageId}
                  className="absolute inset-y-0 left-0 rounded-[4px] bg-[#8a67ee] transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              )}
            </i>
            <b className="text-[11px] text-[#52407a]">
              {indeterminate ? "…" : `${progress}%`}
            </b>
          </div>
          <small className="col-start-2 col-end-[-1] -mt-1 text-[11px] text-[#53648e]">
            {indeterminate
              ? "Starting…"
              : progress < 30
                ? "Initializing..."
                : progress < 60
                  ? "Processing content..."
                  : progress < 85
                    ? "Embedding content and creating relationships"
                    : "Finalizing..."}
          </small>
        </>
      )}
    </div>
  );
}
