import assert from "node:assert/strict";
import test from "node:test";
import { applyTheme, setThemeLock, type ThemeTarget } from "../lib/theme/apply.ts";

// A minimal stand-in for <html>, recording exactly what applyTheme writes.
function makeTarget() {
  const classes = new Set<string>();
  const dataset: Record<string, string> = {};
  const style = { colorScheme: "" };
  const target: ThemeTarget = {
    classList: {
      toggle(name: string, force: boolean) {
        if (force) classes.add(name);
        else classes.delete(name);
      },
    },
    dataset,
    style,
  };
  return {
    target,
    state: () => ({
      dark: classes.has("dark"),
      dataTheme: dataset.theme,
      colorScheme: style.colorScheme,
    }),
  };
}

test.afterEach(() => {
  setThemeLock(null);
});

// Break caught: applyTheme paints the requested theme without writing
// colorScheme, so native controls and scrollbars keep the wrong scheme.
test("applying a theme writes the dark class, data-theme, and color-scheme", () => {
  const { target, state } = makeTarget();
  applyTheme(target, "dark", false);
  assert.deepEqual(state(), { dark: true, dataTheme: "dark", colorScheme: "dark" });

  applyTheme(target, "light", true);
  assert.deepEqual(state(), { dark: false, dataTheme: "light", colorScheme: "light" });
});

// Break caught: "system" stops consulting the OS preference at paint time.
test("applying system resolves from the OS preference", () => {
  const { target, state } = makeTarget();
  applyTheme(target, "system", true);
  assert.deepEqual(state(), { dark: true, dataTheme: "dark", colorScheme: "dark" });

  applyTheme(target, "system", false);
  assert.deepEqual(state(), { dark: false, dataTheme: "light", colorScheme: "light" });
});

// Break caught: the lock stops overriding the caller's theme, so onboarding
// paints dark for a user who chose dark in the dashboard.
test("an active lock overrides the theme being applied", () => {
  const { target, state } = makeTarget();
  setThemeLock("light");

  assert.equal(applyTheme(target, "dark", false), "light");
  assert.deepEqual(state(), { dark: false, dataTheme: "light", colorScheme: "light" });
});

// Break caught: the lock is bypassed when the OS is dark — the ancestor
// provider's prefers-color-scheme listener re-applies "system" on every OS
// change, and the lock has to win that re-application too.
test("an active lock overrides a system re-application from a dark OS", () => {
  const { target, state } = makeTarget();
  setThemeLock("light");

  applyTheme(target, "light", false);
  applyTheme(target, "system", true);
  assert.deepEqual(state(), { dark: false, dataTheme: "light", colorScheme: "light" });
});

// Break caught: releasing the lock does not repaint, so navigating back out of
// onboarding leaves the user on light even though the dashboard is set to dark.
test("releasing the lock restores the caller's theme", () => {
  const { target, state } = makeTarget();
  setThemeLock("light");
  applyTheme(target, "dark", false);
  assert.deepEqual(state(), { dark: false, dataTheme: "light", colorScheme: "light" });

  setThemeLock(null);
  applyTheme(target, "dark", false);
  assert.deepEqual(state(), { dark: true, dataTheme: "dark", colorScheme: "dark" });
});

// Break caught: no lock means the caller controls the theme, i.e. the
// dashboard/landing toggle stops working.
test("no lock lets the requested theme through", () => {
  const { target, state } = makeTarget();
  setThemeLock(null);
  applyTheme(target, "dark", false);
  assert.deepEqual(state(), { dark: true, dataTheme: "dark", colorScheme: "dark" });
});
