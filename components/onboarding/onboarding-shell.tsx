"use client";
import { useRouter } from "next/navigation";
import { SideRail } from "./design/side-rail";
import { ProgressStepper } from "./design/progress-stepper";
import { OnboardingFooter } from "./onboarding-footer";
import {
  DESIGN_STEP_ORDER,
  type DesignSlug,
} from "@/lib/onboarding/design-steps";
import { getPrevStep } from "@/lib/onboarding/steps";
import type { OnboardingStep } from "@/lib/onboarding/types";

interface Props {
  currentStep: OnboardingStep;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  showSkip?: boolean;
}

export function OnboardingShell({
  currentStep,
  children,
  onNext,
  onBack,
  onSkip,
  isNextDisabled,
  isNextLoading,
  showSkip,
}: Props) {
  // Terminal states (e.g. "complete") render as a centered light screen
  // without wizard chrome — mirrors the reference design's final screen.
  const designSlug = (DESIGN_STEP_ORDER as readonly string[]).includes(
    currentStep,
  )
    ? (currentStep as DesignSlug)
    : null;

  const router = useRouter();
  const prevStep = getPrevStep(currentStep);
  const handleBack =
    onBack ?? (prevStep ? () => router.push(`/onboarding/${prevStep}`) : undefined);

  return (
    <div className="onboarding-theme flex min-h-screen bg-[#f4f7fc] font-[family-name:var(--font-jakarta)]">
      {designSlug && <SideRail currentSlug={designSlug} />}
      <div className="flex min-w-0 flex-1 flex-col p-3 max-[900px]:p-0">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-border bg-surface px-[38px] pb-[22px] pt-[34px] shadow-[0_5px_22px_#cbd5e633] max-[900px]:rounded-none max-[900px]:border max-[900px]:px-5 max-[900px]:py-[25px]">
          {designSlug && (
            <div className="flex-none">
              <ProgressStepper currentSlug={designSlug} />
            </div>
          )}
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          {designSlug && (
            <OnboardingFooter
              currentStep={currentStep}
              onNext={onNext}
              onBack={handleBack}
              onSkip={onSkip}
              isNextDisabled={isNextDisabled}
              isNextLoading={isNextLoading}
              showSkip={showSkip}
            />
          )}
        </div>
      </div>
    </div>
  );
}
