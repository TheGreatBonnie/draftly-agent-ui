"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Braces,
  ClipboardList,
  FileText,
  GitPullRequest,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { RepositoryPicker } from "@/components/onboarding/repository-picker";
import { ErrorBanner } from "@/components/onboarding/error-banner";
import {
  InfoRow,
  cardBase,
  tileBubble,
} from "@/components/onboarding/design/info-row";
import { selectRepository } from "@/api/onboarding";
import { useAsyncAction } from "@/lib/onboarding/use-async-action";
import { useStepGuard } from "@/lib/onboarding/use-step-guard";

export default function RepositoryPage() {
  useStepGuard("repository");
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const { run, loading, error, clearError } = useAsyncAction();

  async function handleNext() {
    if (!selected) return;
    const ok = await run(() => selectRepository({ full_name: selected }));
    if (ok) router.push("/onboarding/documentation");
  }

  const accessRow = "py-[7px]";

  return (
    <OnboardingShell
      currentStep="repository"
      onNext={handleNext}
      isNextDisabled={!selected}
      isNextLoading={loading}
    >
      <h1 className="mb-[11px] mt-8 text-[32px] font-extrabold leading-[1.2] tracking-[-1.2px] text-[#101a43]">
        Choose a repository
      </h1>
      <p className="text-[15px] leading-[1.55] text-[#53648e]">
        Select the GitHub repository you want Draftly to monitor and
        <br /> keep documentation in sync.
      </p>
      {error && <div className="mt-4"><ErrorBanner message={error} onDismiss={clearError} /></div>}
      <div className="mb-8 grid grid-cols-[minmax(0,1fr)_280px] gap-[35px] max-[900px]:grid-cols-1">
        <div>
          <RepositoryPicker onSelect={setSelected} selected={selected} />
        </div>
        <div className={`${cardBase} px-5 py-[22px] max-[900px]:order-2`}>
          <h3 className="mb-2 text-base text-[#101a43]">What Draftly will access</h3>
          <InfoRow
            className={accessRow}
            bubbleClassName={tileBubble}
            icon={<ClipboardList size={17} />}
            title="Repository metadata"
            text="Basic repo information"
          />
          <InfoRow
            className={`${accessRow} border-t border-[#e6ebf3]`}
            bubbleClassName={tileBubble}
            icon={<GitPullRequest size={17} />}
            title="Issues & pull requests"
            text="To understand changes"
          />
          <InfoRow
            className={`${accessRow} border-t border-[#e6ebf3]`}
            bubbleClassName={tileBubble}
            icon={<Braces size={17} />}
            title="Commits & code"
            text="To detect documentation drift"
          />
          <InfoRow
            className={`${accessRow} border-t border-[#e6ebf3]`}
            bubbleClassName={tileBubble}
            icon={<Tag size={17} />}
            title="Releases"
            text="To track product evolution"
          />
          <InfoRow
            className={`${accessRow} border-t border-[#e6ebf3]`}
            bubbleClassName={tileBubble}
            icon={<FileText size={17} />}
            title="Documentation files"
            text="To analyze and improve"
          />
          <div className="rounded-[9px] bg-[#f0f5ff] p-[15px] text-xs leading-[1.5] text-[#263a6f]">
            <ShieldCheck
              size={20}
              className="float-left mr-2.5 box-content rounded-lg bg-[#dce8fd] p-1.5 text-brand"
            />
            <b>Read-only access</b>
            <p className="mt-1.5 text-[11px] text-[#50618a]">
              Draftly never writes to your repositories or makes changes.
            </p>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
