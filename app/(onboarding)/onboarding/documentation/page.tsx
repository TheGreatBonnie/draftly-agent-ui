"use client";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { DocumentationSources } from "@/components/onboarding/documentation-sources";
import { ErrorBanner } from "@/components/onboarding/error-banner";
import { confirmSources } from "@/api/onboarding";
import { useAsyncAction } from "@/lib/onboarding/use-async-action";
import { clearOnboardingDraft } from "@/lib/onboarding/use-draft";
import { useStepGuard } from "@/lib/onboarding/use-step-guard";

export default function DocumentationPage() {
  useStepGuard("documentation");
  const router = useRouter();
  const { run, loading, error, clearError } = useAsyncAction();

  async function handleConfirm(include: string[], exclude: string[]) {
    const ok = await run(() => confirmSources({ include, exclude }));
    if (ok) {
      clearOnboardingDraft("documentation");
      router.push("/onboarding/integrations");
    }
  }

  return (
    <OnboardingShell currentStep="documentation" isNextLoading={loading}>
      <h1 className="mb-[11px] mt-8 text-[32px] font-extrabold leading-[1.2] tracking-[-1.2px] text-[#101a43]">
        Discover your documentation
      </h1>
      <p className="text-[15px] leading-[1.55] text-[#53648e]">
        We discovered the documentation sources you configured.
        <br />
        Review and confirm them, or run a sync to refresh.
      </p>
      {error && <div className="mt-4"><ErrorBanner message={error} onDismiss={clearError} /></div>}
      <div className="mb-8">
        <DocumentationSources onConfirm={handleConfirm} loading={loading} />
      </div>
    </OnboardingShell>
  );
}
