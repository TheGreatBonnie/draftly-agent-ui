"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OnboardingComplete } from "@/components/onboarding/onboarding-complete";
import { ErrorBanner } from "@/components/onboarding/error-banner";
import { completeOnboarding, getOnboardingStatus } from "@/api/onboarding";
import { useStepGuard } from "@/lib/onboarding/use-step-guard";
import { STATE_TO_STEP } from "@/lib/onboarding/constants";

export default function CompletePage() {
  useStepGuard("complete");
  const { replace } = useRouter();
  const [counts, setCounts] = useState({ documents: 0, chunks: 0 });
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const finalizeStartedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    // Guard-order fix: confirm COMPLETED status BEFORE finalizing so a
    // non-COMPLETED row never triggers POST /complete (spec §5.2).
    getOnboardingStatus()
      .then((status) => {
        if (cancelled) return null;
        if (status.state !== "COMPLETED") {
          const expected = STATE_TO_STEP[status.state] ?? "workspace";
          replace(`/onboarding/${expected}`);
          return null;
        }
        if (finalizeStartedRef.current) return null;
        finalizeStartedRef.current = true;
        return completeOnboarding().then(() => getOnboardingStatus());
      })
      .then((s) => {
        if (!s || cancelled) return;
        const repo = s.selected_repository as Record<string, unknown> | null;
        setCounts({
          documents: (repo?.document_count as number) ?? 0,
          chunks: (repo?.chunk_count as number) ?? 0,
        });
      })
      .catch(() => {
        setFinalizeError(
          "We couldn't finalize your onboarding. Please re-run initialization if this persists."
        );
      });
    return () => {
      cancelled = true;
    };
  }, [replace]);

  return (
    <OnboardingShell currentStep="complete">
      <div className="mt-8">
        {finalizeError && <ErrorBanner message={finalizeError} />}
      </div>
      <OnboardingComplete documentCount={counts.documents} chunkCount={counts.chunks} />
    </OnboardingShell>
  );
}
