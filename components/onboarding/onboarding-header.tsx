"use client";
import { DraftlyLogo } from "@/components/dashboard/draftly-logo";

export function OnboardingHeader() {
  return (
    <header className="flex items-center border-b border-slate-200 bg-white px-6 py-4">
      <DraftlyLogo />
      <span className="ml-3 text-sm font-medium text-slate-600">Onboarding</span>
    </header>
  );
}
