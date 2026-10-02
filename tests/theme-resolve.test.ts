import assert from "node:assert/strict";
import test from "node:test";
import {
  isOnboardingPath,
  resolveTheme,
} from "../lib/theme/resolve.ts";

// Break caught: an explicit stored theme stops overriding the OS preference
// (or vice versa) in the shared resolver.
test("an explicit theme wins over the OS preference", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});

// Break caught: "system" stops deferring to prefers-color-scheme.
test("system follows the OS preference", () => {
  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
});

// Break caught: a prefix match that is too loose sends a non-onboarding route
// (e.g. /onboardingx) to the light-locked scope and strips its dark theme.
test("onboarding paths are matched on a whole path segment", () => {
  assert.equal(isOnboardingPath("/onboarding"), true);
  assert.equal(isOnboardingPath("/onboarding/welcome"), true);
  assert.equal(isOnboardingPath("/onboarding/github"), true);
  assert.equal(isOnboardingPath("/onboardingx"), false);
  assert.equal(isOnboardingPath("/overview"), false);
  assert.equal(isOnboardingPath(""), false);
});
