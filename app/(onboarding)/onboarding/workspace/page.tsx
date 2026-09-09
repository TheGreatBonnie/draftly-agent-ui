"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, ShieldCheck, Users } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { WorkspaceForm } from "@/components/onboarding/workspace-form";
import { InfoRow, cardBase, sideBubble } from "@/components/onboarding/design/info-row";
import { ErrorBanner } from "@/components/onboarding/error-banner";
import { createWorkspace } from "@/api/onboarding";
import { useAsyncAction } from "@/lib/onboarding/use-async-action";
import { clearOnboardingDraft } from "@/lib/onboarding/use-draft";
import { useStepGuard } from "@/lib/onboarding/use-step-guard";

export default function WorkspacePage() {
  useStepGuard("workspace");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { run, loading, error, clearError } = useAsyncAction();

  async function handleNext(name: string, description: string) {
    const ok = await run(() => createWorkspace({ name, description }));
    if (ok) {
      clearOnboardingDraft("workspace");
      router.push("/onboarding/github");
    }
  }

  return (
    <OnboardingShell
      currentStep="workspace"
      onNext={() => formRef.current?.requestSubmit()}
      isNextLoading={loading}
    >
      <h1 className="mb-[11px] mt-8 text-[32px] font-extrabold leading-[1.2] tracking-[-1.2px] text-[#101a43]">
        Create your workspace
      </h1>
      <p className="text-[15px] leading-[1.55] text-[#53648e]">
        Give your workspace a name and description.
        <br />
        This is where your team&apos;s documentation lives.
      </p>
      {error && <div className="mt-4"><ErrorBanner message={error} onDismiss={clearError} /></div>}
      <div className="mb-8 grid grid-cols-[minmax(0,1fr)_280px] gap-[35px] max-[900px]:grid-cols-1">
        <div>
          <WorkspaceForm onSubmit={handleNext} formRef={formRef} />
        </div>
        <div className={`${cardBase} px-5 py-[22px] max-[900px]:order-2`}>
          <h3 className="mb-2 text-base text-[#101a43]">What is a workspace?</h3>
          <InfoRow
            bubbleClassName={sideBubble}
            icon={<FolderOpen />}
            title="Your project home"
            text="A workspace groups your repository, sources, and documentation together."
          />
          <InfoRow
            className="border-t border-[#e6ebf3]"
            bubbleClassName={sideBubble}
            icon={<Users />}
            title="Team collaboration"
            text="Your team members will access documentation through this workspace."
            tone="green"
          />
          <InfoRow
            className="border-t border-[#e6ebf3]"
            bubbleClassName={sideBubble}
            icon={<ShieldCheck />}
            title="You stay in control"
            text="Manage settings, sources, and access from one place."
            tone="purple"
          />
        </div>
      </div>
    </OnboardingShell>
  );
}
