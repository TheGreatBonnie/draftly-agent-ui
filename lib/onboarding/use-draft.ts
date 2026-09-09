"use client";
import { useCallback, useSyncExternalStore } from "react";

import type { OnboardingStep } from "./types";

const PREFIX = "draftly:onboarding-draft:";

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function readRaw(step: OnboardingStep): string | null {
  try {
    return localStorage.getItem(PREFIX + step);
  } catch {
    return null;
  }
}

export function clearOnboardingDraft(step: OnboardingStep): void {
  try {
    localStorage.removeItem(PREFIX + step);
  } catch {
    // Storage unavailable (private mode/quota): drafts are best-effort.
  }
  emit();
}

export function clearAllOnboardingDrafts(): void {
  try {
    const stale: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null && key.startsWith(PREFIX)) stale.push(key);
    }
    stale.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage unavailable (private mode/quota): drafts are best-effort.
  }
  emit();
}

export function useStepDraft<T>(
  step: OnboardingStep,
  initial: T
): [T, (value: T) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(step),
    () => null,
  );

  let value = initial;
  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw) as T;
      // A persisted draft may predate a schema field (e.g. `automation`).
      // Merge over the defaults so missing keys keep their initial value
      // instead of becoming `undefined`.
      if (
        parsed !== null &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        value = { ...(initial as object), ...(parsed as object) } as T;
      } else {
        value = parsed;
      }
    } catch {
      value = initial;
    }
  }

  const setDraft = useCallback(
    (next: T) => {
      try {
        localStorage.setItem(PREFIX + step, JSON.stringify(next));
      } catch {
        // Storage unavailable (private mode/quota): in-memory still works.
      }
      emit();
    },
    [step],
  );

  return [value, setDraft];
}
