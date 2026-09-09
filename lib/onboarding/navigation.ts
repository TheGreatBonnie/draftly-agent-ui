import type { OnboardingStep } from "./types";
import { STEP_ORDER } from "./constants";

export function getOnboardingUrl(step: OnboardingStep): string {
  return `/onboarding/${step}`;
}

export function getStepFromPathname(pathname: string): OnboardingStep | null {
  const match = pathname.match(/\/onboarding\/(\w+)/);
  if (!match) return null;
  const step = match[1] as OnboardingStep;
  return STEP_ORDER.includes(step) ? step : null;
}

export function getNextOnboardingUrl(currentStep: OnboardingStep): string | null {
  const index = STEP_ORDER.indexOf(currentStep);
  if (index === -1 || index === STEP_ORDER.length - 1) return null;
  return getOnboardingUrl(STEP_ORDER[index + 1]);
}

export function getPrevOnboardingUrl(currentStep: OnboardingStep): string | null {
  const index = STEP_ORDER.indexOf(currentStep);
  if (index <= 0) return null;
  return getOnboardingUrl(STEP_ORDER[index - 1]);
}
