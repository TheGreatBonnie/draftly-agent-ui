import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { THEME_SCRIPT } from "../lib/theme/theme-script.ts";

// Runs the real pre-hydration script against a fake DOM and reports the
// observable side effects it left behind on <html>.
function runScript(input: {
  saved: string | null;
  prefersDark: boolean;
  pathname: string;
}) {
  const classes = new Set<string>();
  const dataset: Record<string, string> = {};
  const style: Record<string, string> = {};

  const sandbox = {
    document: {
      documentElement: {
        classList: {
          toggle(name: string, force: boolean) {
            if (force) classes.add(name);
            else classes.delete(name);
          },
        },
        dataset,
        style,
      },
    },
    location: { pathname: input.pathname },
    localStorage: {
      getItem: (key: string) => (key === "draftly-theme" ? input.saved : null),
    },
    window: {
      matchMedia: (query: string) => ({
        matches: input.prefersDark && query.includes("dark"),
      }),
    },
  };

  vm.createContext(sandbox);
  vm.runInContext(THEME_SCRIPT, sandbox);

  return {
    dark: classes.has("dark"),
    dataTheme: dataset.theme,
    colorScheme: style.colorScheme,
  };
}

// Break caught: the script stops applying a stored dark theme, leaving every
// dark-mode user on a light dashboard before React hydrates.
test("a stored dark theme paints <html> dark outside onboarding", () => {
  assert.deepEqual(runScript({ saved: "dark", prefersDark: false, pathname: "/overview" }), {
    dark: true,
    dataTheme: "dark",
    colorScheme: "dark",
  });
});

// Break caught: the script never removes a stale .dark class, so a user who
// switches back to a light theme still sees dark until hydration.
test("a stored light theme leaves <html> light", () => {
  assert.deepEqual(runScript({ saved: "light", prefersDark: true, pathname: "/overview" }), {
    dark: false,
    dataTheme: "light",
    colorScheme: "light",
  });
});

// Break caught: the stored "system" value stops deferring to the OS, pinning
// OS-dark users to light (or vice versa) on first paint.
test("a stored system theme paints <html> from the OS preference", () => {
  assert.deepEqual(runScript({ saved: "system", prefersDark: true, pathname: "/overview" }), {
    dark: true,
    dataTheme: "dark",
    colorScheme: "dark",
  });
  assert.deepEqual(runScript({ saved: "system", prefersDark: false, pathname: "/overview" }), {
    dark: false,
    dataTheme: "light",
    colorScheme: "light",
  });
});

// Break caught: no stored preference stops falling back to the OS, so a first
// visit on a dark desktop paints light for one frame.
test("a first visit with nothing stored follows the OS preference", () => {
  assert.deepEqual(runScript({ saved: null, prefersDark: true, pathname: "/overview" }), {
    dark: true,
    dataTheme: "dark",
    colorScheme: "dark",
  });
  assert.deepEqual(runScript({ saved: null, prefersDark: false, pathname: "/overview" }), {
    dark: false,
    dataTheme: "light",
    colorScheme: "light",
  });
});

// Break caught: the pre-hydration script starts honouring a stored dark theme
// on onboarding routes, flashing dark before the locked provider corrects it.
test("a stored dark theme paints <html> light on onboarding routes", () => {
  assert.deepEqual(
    runScript({ saved: "dark", prefersDark: false, pathname: "/onboarding/welcome" }),
    { dark: false, dataTheme: "light", colorScheme: "light" },
  );
});

// Break caught: the onboarding guard is scoped too narrowly or too loosely, so
// an onboarding route flashes dark or a sibling route loses its dark theme.
test("the onboarding guard covers every onboarding step and nothing else", () => {
  for (const pathname of [
    "/onboarding",
    "/onboarding/workspace",
    "/onboarding/repository",
    "/onboarding/github",
    "/onboarding/integrations",
    "/onboarding/documentation",
    "/onboarding/preferences",
    "/onboarding/initialize",
    "/onboarding/complete",
  ]) {
    assert.deepEqual(
      runScript({ saved: "dark", prefersDark: true, pathname }),
      { dark: false, dataTheme: "light", colorScheme: "light" },
      `expected ${pathname} to paint light`,
    );
  }

  assert.deepEqual(runScript({ saved: "dark", prefersDark: true, pathname: "/onboardingx" }), {
    dark: true,
    dataTheme: "dark",
    colorScheme: "dark",
  });
});
