import { resolveTheme, type ResolvedTheme, type Theme } from "./resolve.ts";

/**
 * The slice of `document.documentElement` that theming writes to. Declared
 * structurally so the paint path can be exercised without a DOM.
 */
export interface ThemeTarget {
  classList: { toggle(name: string, force: boolean): void };
  dataset: { [name: string]: string | undefined };
  style: { colorScheme: string };
}

/**
 * The innermost mounted light-only scope, or null when none is active.
 *
 * The lock lives here rather than in provider state because `applyTheme` is the
 * single place that touches `<html>`, and *every* provider in the tree calls
 * it — including an ancestor's `prefers-color-scheme` listener, which re-applies
 * on each OS change. Resolving the lock inside `applyTheme` means a late
 * re-application still lands on the locked theme. React runs child effects
 * before ancestors', so a scope registers its lock before any ancestor paints.
 */
let activeLock: Theme | null = null;

export function setThemeLock(theme: Theme | null): void {
  activeLock = theme;
}

/** Paints `theme` onto `doc` and returns what was actually applied. */
export function applyTheme(
  doc: ThemeTarget,
  theme: Theme,
  prefersDark: boolean,
): ResolvedTheme {
  const resolved = resolveTheme(activeLock ?? theme, prefersDark);
  doc.classList.toggle("dark", resolved === "dark");
  doc.dataset.theme = resolved;
  doc.style.colorScheme = resolved;
  return resolved;
}
