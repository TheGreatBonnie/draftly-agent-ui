export const DESIGN_STEP_ORDER = [
  "welcome",
  "workspace",
  "github",
  "repository",
  "documentation",
  "integrations",
  "preferences",
  "initialize",
] as const;

export type DesignSlug = (typeof DESIGN_STEP_ORDER)[number];

export const DESIGN_STEP_NUMBER: Record<DesignSlug, number> = {
  welcome: 1,
  workspace: 2,
  github: 3,
  repository: 4,
  documentation: 5,
  integrations: 6,
  preferences: 7,
  initialize: 8,
};

export const DESIGN_STEP_LABELS: Record<DesignSlug, string> = {
  welcome: "Welcome",
  workspace: "Workspace",
  github: "Connect GitHub",
  repository: "Select Repository",
  documentation: "Discover Docs",
  integrations: "Connect Sources",
  preferences: "Configure Draftly",
  initialize: "Review & Finish",
};
