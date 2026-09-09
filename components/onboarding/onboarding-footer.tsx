"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPrevStep, getNextStep } from "@/lib/onboarding/steps";
import { REQUIRED_STEPS } from "@/lib/onboarding/constants";
import { DesignButton } from "./design/button";
import type { OnboardingStep } from "@/lib/onboarding/types";

interface Props {
  currentStep: OnboardingStep;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  showSkip?: boolean;
}

export function OnboardingFooter({
  currentStep,
  onNext,
  onBack,
  onSkip,
  isNextDisabled,
  isNextLoading,
  showSkip,
}: Props) {
  const prev = getPrevStep(currentStep);
  const next = getNextStep(currentStep);
  const isOptional = !REQUIRED_STEPS.includes(currentStep);

  return (
    <div className="sticky bottom-0 z-[2] mt-[14px] flex items-center justify-between border-t border-border bg-surface pt-[14px]">
      <div>
        {prev && (
          <DesignButton onClick={onBack}>
            <ArrowLeft size={17} /> Back
          </DesignButton>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showSkip && isOptional && (
          <button
            onClick={onSkip}
            className="rounded px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground"
          >
            Skip
          </button>
        )}
        {next && onNext && (
          <DesignButton
            primary
            onClick={onNext}
            disabled={isNextDisabled || isNextLoading}
            className="px-[18px]"
          >
            {isNextLoading ? "Working…" : currentStep === "initialize" ? "Initialize" : "Next"}
            {!isNextLoading && <ArrowRight size={18} />}
          </DesignButton>
        )}
      </div>
    </div>
  );
}
