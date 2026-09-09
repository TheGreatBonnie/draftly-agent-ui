"use client";
import { DraftlyLogo } from "@/components/dashboard/draftly-logo";

export function OnboardingHeader() {
  return (
    <header className="flex items-center border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
      <DraftlyLogo />
      <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400">Onboarding</span>
    </header>
  );
}
