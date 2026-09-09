"use client";
import { STEP_ORDER, STEP_LABELS } from "@/lib/onboarding/constants";
import type { OnboardingStep } from "@/lib/onboarding/types";

export function OnboardingProgress({ currentStep }: { currentStep: OnboardingStep }) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  return (
    <div className="flex items-center justify-center gap-2 border-b border-border bg-surface px-6 py-3">
      {STEP_ORDER.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
              i < currentIndex
                ? "bg-emerald-500 text-white"
                : i === currentIndex
                  ? "bg-blue-600 text-white"
                  : "bg-surface-subtle text-foreground-muted"
            }`}
          >
            {i < currentIndex ? "✓" : i + 1}
          </div>
          <span className="hidden text-xs text-foreground-secondary md:inline">
            {STEP_LABELS[step]}
          </span>
          {i < STEP_ORDER.length - 1 && <div className="mx-1 h-px w-4 bg-border-strong" />}
        </div>
      ))}
    </div>
  );
}
