import type { OnboardingStep } from "./types";
import { STEP_ORDER } from "./constants";

interface StepConfig {
  id: OnboardingStep;
  validate: () => boolean | Promise<boolean>;
  next: OnboardingStep | null;
  prev: OnboardingStep | null;
}

const configs: Record<OnboardingStep, StepConfig> = {
  workspace: { id: "workspace", validate: async () => true, next: "github", prev: null },
  github: { id: "github", validate: async () => true, next: "repository", prev: "workspace" },
  repository: { id: "repository", validate: async () => true, next: "documentation", prev: "github" },
  documentation: { id: "documentation", validate: async () => true, next: "integrations", prev: "repository" },
  integrations: { id: "integrations", validate: async () => true, next: "preferences", prev: "documentation" },
  preferences: { id: "preferences", validate: async () => true, next: "initialize", prev: "integrations" },
  initialize: { id: "initialize", validate: async () => true, next: "complete", prev: "preferences" },
  complete: { id: "complete", validate: async () => true, next: null, prev: "initialize" },
};

export function getStepConfig(step: OnboardingStep) {
  return configs[step];
}
export function getNextStep(step: OnboardingStep) {
  return configs[step].next;
}
export function getPrevStep(step: OnboardingStep) {
  return configs[step].prev;
}
export function getStepIndex(step: OnboardingStep) {
  return STEP_ORDER.indexOf(step);
}
