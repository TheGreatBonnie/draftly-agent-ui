"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOnboardingStatus } from "@/api/onboarding";
import { STATE_TO_STEP, STEP_ORDER } from "./constants";
import { clearAllOnboardingDrafts } from "./use-draft";
import type { OnboardingStep } from "./types";

export function useStepGuard(step: OnboardingStep): void {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    getOnboardingStatus()
      .then((status) => {
        if (cancelled) return;
        if (status.state === "COMPLETED") {
          clearAllOnboardingDrafts();
          if (step !== "complete") router.replace("/dashboard");
          return;
        }
        const expected = STATE_TO_STEP[status.state] ?? "workspace";
        if (step === "complete") {
          router.replace(`/onboarding/${expected}`);
          return;
        }
        if (STEP_ORDER.indexOf(step) > STEP_ORDER.indexOf(expected)) {
          router.replace(`/onboarding/${expected}`);
        }
      })
      .catch(() => {
        // Status unavailable (backend down / network): stay put rather than trap the user.
      });
    return () => {
      cancelled = true;
    };
  }, [router, step]);
}
