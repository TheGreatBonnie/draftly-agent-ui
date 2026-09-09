"use client";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { IntegrationPicker } from "@/components/onboarding/integration-picker";
import { ErrorBanner } from "@/components/onboarding/error-banner";
import { configureIntegrations } from "@/api/onboarding";
import { useAsyncAction } from "@/lib/onboarding/use-async-action";
import { clearOnboardingDraft } from "@/lib/onboarding/use-draft";
import { useStepGuard } from "@/lib/onboarding/use-step-guard";

export default function IntegrationsPage() {
  useStepGuard("integrations");
  const router = useRouter();
  const { run, loading, error, clearError } = useAsyncAction();

  async function handleSubmit(slack: boolean, discord: boolean) {
    const ok = await run(() => configureIntegrations({ slack, discord }));
    if (ok) {
      clearOnboardingDraft("integrations");
      router.push("/onboarding/preferences");
    }
  }

  return (
    <OnboardingShell
      currentStep="integrations"
      onSkip={() => router.push("/onboarding/preferences")}
      showSkip
      isNextLoading={loading}
    >
      <h1 className="mb-[11px] mt-8 text-[32px] font-extrabold leading-[1.2] tracking-[-1.2px] text-[#101a43]">
        Connect your sources
      </h1>
      <p className="text-[15px] leading-[1.55] text-[#53648e]">
        Add the tools and conversations where your team works.
        <br /> Draftly will learn from these signals to keep docs accurate.
      </p>
      {error && <div className="mt-4"><ErrorBanner message={error} onDismiss={clearError} /></div>}
      <div className="mb-8">
        <IntegrationPicker onSubmit={handleSubmit} loading={loading} />
      </div>
    </OnboardingShell>
  );
}
