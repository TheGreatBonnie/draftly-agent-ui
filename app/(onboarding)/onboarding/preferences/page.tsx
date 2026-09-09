"use client";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { PreferencesForm } from "@/components/onboarding/preferences-form";
import { ErrorBanner } from "@/components/onboarding/error-banner";
import { configurePreferences } from "@/api/onboarding";
import { useAsyncAction } from "@/lib/onboarding/use-async-action";
import { clearOnboardingDraft } from "@/lib/onboarding/use-draft";
import { useStepGuard } from "@/lib/onboarding/use-step-guard";

export default function PreferencesPage() {
  useStepGuard("preferences");
  const router = useRouter();
  const { run, loading, error, clearError } = useAsyncAction();

  async function handleSubmit(
    style: string,
    reviewPolicy: string,
    autoPublish: boolean,
    automation: boolean[],
  ) {
    const ok = await run(() =>
      configurePreferences({
        style,
        review_policy: reviewPolicy,
        auto_publish: autoPublish,
        automation: {
          detect_drift: automation[0],
          evaluate_docs: automation[1],
          suggest_improvements: automation[2],
          reply_to_questions: automation[3],
          auto_publish_low_risk: automation[4],
        },
      })
    );
    if (ok) {
      clearOnboardingDraft("preferences");
      router.push("/onboarding/initialize");
    }
  }

  return (
    <OnboardingShell
      currentStep="preferences"
      onSkip={() => router.push("/onboarding/initialize")}
      showSkip
      isNextLoading={loading}
    >
      <h1 className="mb-[11px] mt-8 text-[32px] font-extrabold leading-[1.2] tracking-[-1.2px] text-[#101a43]">
        Configure Draftly
      </h1>
      <p className="text-[15px] leading-[1.55] text-[#53648e]">
        Set how Draftly should work with your team and documentation.
        <br /> You can adjust these preferences anytime.
      </p>
      {error && <div className="mt-4"><ErrorBanner message={error} onDismiss={clearError} /></div>}
      <div className="mt-6">
        <PreferencesForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </OnboardingShell>
  );
}
