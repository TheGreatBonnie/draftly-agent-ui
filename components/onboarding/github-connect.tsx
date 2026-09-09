"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getInstallUrl, listInstallations } from "@/api/github";
import { connectGitHub } from "@/api/onboarding";
import { ApiError } from "@/api/client";
import { Check } from "lucide-react";
import { GithubIcon } from "@/components/onboarding/design/glyphs";

type Phase = "loading" | "awaiting-install" | "connecting" | "linked" | "error";

const POLL_INTERVAL_MS = 5000;

export function GitHubConnect({
  onConnectedChange,
  pollIntervalMs = POLL_INTERVAL_MS,
  /** Installation id captured from ?installation_id= (setup redirect) —
   *  connects immediately instead of waiting for the poll to observe it. */
  installationId,
}: {
  onConnectedChange?: (connected: boolean) => void;
  pollIntervalMs?: number;
  installationId?: number | null;
}) {
  const [installUrl, setInstallUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const cancelledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef<() => Promise<void>>(async () => {});

  const pendingInstallRef = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    if (installationId != null) pendingInstallRef.current = installationId;
  }, [installationId]);

  const linkInstallation = useCallback(
    async (id: number): Promise<void> => {
      setPhase("connecting");
      try {
        await connectGitHub({ installation_id: id });
        if (!cancelledRef.current) {
          setPhase("linked");
          onConnectedChange?.(true);
        }
      } catch (e) {
        if (!cancelledRef.current) {
          setPhase("error");
          setErrorMsg(
            e instanceof ApiError
              ? e.message
              : "Failed to connect your GitHub installation."
          );
        }
      }
    },
    [onConnectedChange]
  );

  const attempt = useCallback(async (): Promise<void> => {
    setPhase((p) => (p === "linked" ? p : "loading"));
    const [url, installs] = await Promise.all([
      getInstallUrl("/onboarding/github").catch(() => null),
      // Skip the installations probe on setup-redirect handoff.
      pendingInstallRef.current != null
        ? Promise.resolve([])
        : listInstallations().catch(() => []),
    ]);
    if (cancelledRef.current) return;
    setInstallUrl(url?.install_url ?? null);

    // Setup-redirect handoff: link right away, no polling wait.
    const pendingId = pendingInstallRef.current;
    if (pendingId != null) {
      pendingInstallRef.current = null;
      await linkInstallation(pendingId);
      return;
    }

    if (installs.length === 0) {
      setPhase("awaiting-install");
      // Self-schedule via ref: keying the next poll on a phase-only effect
      // misses runs when React batches the loading→awaiting transition into
      // a single commit (phase unchanged → effect deps unchanged).
      timerRef.current = setTimeout(() => void attemptRef.current(), pollIntervalMs);
      return;
    }

    await linkInstallation(installs[0].installation_id);
  }, [linkInstallation, pollIntervalMs]);

  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  useEffect(() => {
    cancelledRef.current = false;
    // Defer via timer: attempt() sets state, and synchronous setState inside
    // an effect body is a cascading-render hazard (and a lint error here).
    const kickoff = setTimeout(() => void attemptRef.current(), 0);
    return () => {
      cancelledRef.current = true;
      clearTimeout(kickoff);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [attempt]);

  if (phase === "loading" || phase === "connecting") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center justify-center gap-2 py-8 text-sm text-[#53648e]"
      >
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-dotted border-[#814ef0]"
        />
        {phase === "connecting" ? "Connecting…" : "Loading..."}
      </div>
    );
  }

  if (phase === "linked") {
    return (
      <div className="mx-auto flex w-[min(300px,100%)] items-center justify-center gap-2.5 rounded-lg bg-[#e7f8f0] px-6 py-[clamp(10px,1.5vh,14px)] text-[clamp(13px,1.75vh,16px)] font-bold text-[#19a36d]">
        <Check size={18} /> GitHub Connected
      </div>
    );
  }

  return (
    <div className="col-span-full flex flex-col items-center gap-3">
      {phase === "error" && (
        <div role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">
          {errorMsg}
        </div>
      )}
      {phase === "awaiting-install" && (
        <small className="text-xs text-[#647397]">
          Waiting for installation… you can close the GitHub tab once done.
        </small>
      )}
      <button
        onClick={() => installUrl && window.open(installUrl, "_blank")}
        className="mx-auto mt-[clamp(4px,1vh,10px)] flex w-[min(300px,100%)] items-center justify-center gap-2.5 rounded-lg bg-foreground px-6 py-[clamp(10px,1.5vh,14px)] text-[clamp(13px,1.75vh,16px)] font-bold text-background transition hover:opacity-90"
      >
        <GithubIcon size={20} />
        {phase === "error" ? "Try again" : "Install GitHub App"}
      </button>
      {phase === "error" && (
        <button
          onClick={() => void attempt()}
          className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline"
        >
          Retry connection
        </button>
      )}
    </div>
  );
}
