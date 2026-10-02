export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "draftly-theme";
export const ONBOARDING_PATH_PREFIX = "/onboarding";

/**
 * Onboarding renders light-only, so its route family is identified here rather
 * than in the provider: the pre-hydration script needs the same answer and
 * cannot import React state.
 *
 * Matched on a whole path segment so a sibling route such as `/onboardingx`
 * is not dragged into the light-only scope.
 */
export function isOnboardingPath(pathname: string): boolean {
  return (
    pathname === ONBOARDING_PATH_PREFIX ||
    pathname.startsWith(`${ONBOARDING_PATH_PREFIX}/`)
  );
}

/** An explicit theme beats the OS preference; only `system` defers to it. */
export function resolveTheme(theme: Theme, prefersDark: boolean): ResolvedTheme {
  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
}
