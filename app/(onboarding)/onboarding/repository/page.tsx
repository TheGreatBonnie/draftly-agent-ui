"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, GitPullRequest, Globe, Layers, ShieldCheck, Tag } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { RepositoryPicker } from "@/components/onboarding/repository-picker";
import { PublicDocsSource } from "@/components/onboarding/public-docs-source";
import { ErrorBanner } from "@/components/onboarding/error-banner";
import { InfoRow, cardBase, tileBubble } from "@/components/onboarding/design/info-row";
import { selectRepository } from "@/api/onboarding";
import { useAsyncAction } from "@/lib/onboarding/use-async-action";
import { useStepGuard } from "@/lib/onboarding/use-step-guard";
import {
  buildRepositoryPayload,
  type PublicDocsDraft,
} from "@/lib/onboarding/source-model";
import { cn } from "@/lib/utils";

type SourceMode = "github" | "public";

const modeButton =
  "inline-flex items-center gap-2 rounded-lg border border-[#cdd8ea] bg-white px-[14px] py-[9px] text-[13px] font-semibold text-[#465574] transition-colors";

export default function RepositoryPage() {
  useStepGuard("repository");
  const router = useRouter();
  const [mode, setMode] = useState<SourceMode>("github");
  const [selected, setSelected] = useState<string | null>(null);
  const publicFormRef = useRef<HTMLFormElement>(null);
  const { run, loading, error, clearError } = useAsyncAction();

  async function handleGitHubNext() {
    if (!selected) return;
    const ok = await run(() => selectRepository({ full_name: selected }));
    if (ok) router.push("/onboarding/documentation");
  }

  async function handlePublicNext(draft: PublicDocsDraft) {
    const ok = await run(() => selectRepository(buildRepositoryPayload(draft)));
    if (ok) router.push("/onboarding/documentation");
  }

  function handleNext() {
    if (mode === "github") void handleGitHubNext();
    else publicFormRef.current?.requestSubmit();
  }

  const accessRow = "py-[7px]";

  return (
    <OnboardingShell
      currentStep="repository"
      onNext={handleNext}
      isNextDisabled={mode === "github" ? !selected : false}
      isNextLoading={loading}
    >
      <h1 className="mb-[11px] mt-8 text-[32px] font-extrabold leading-[1.2] tracking-[-1.2px] text-[#101a43]">
        Choose a documentation source
      </h1>
      <p className="text-[15px] leading-[1.55] text-[#53648e]">
        Select a GitHub repository Draftly monitors, or point Draftly at
        <br /> public documentation to keep in sync.
      </p>
      {error && <div className="mt-4"><ErrorBanner message={error} onDismiss={clearError} /></div>}

      <div className="mb-6 flex gap-2.5">
        <button
          type="button"
          onClick={() => setMode("github")}
          aria-pressed={mode === "github"}
          className={cn(modeButton, mode === "github" && "border-brand bg-[#f5f8ff] text-brand")}
        >
          <GitPullRequest size={16} /> GitHub repository
        </button>
        <button
          type="button"
          onClick={() => setMode("public")}
          aria-pressed={mode === "public"}
          className={cn(modeButton, mode === "public" && "border-brand bg-[#f5f8ff] text-brand")}
        >
          <Globe size={16} /> Public documentation
        </button>
      </div>

      <div className="mb-8 grid grid-cols-[minmax(0,1fr)_280px] gap-[35px] max-[900px]:grid-cols-1">
        {mode === "github" ? (
          <RepositoryPicker onSelect={setSelected} selected={selected} />
        ) : (
          <PublicDocsSource formRef={publicFormRef} onSubmit={handlePublicNext} />
        )}
        <div className={`${cardBase} px-5 py-[22px] max-[900px]:order-2`}>
          <h3 className="mb-2 text-base text-[#101a43]">What Draftly will access</h3>
          {mode === "github" ? (
            <>
              <InfoRow className={accessRow} bubbleClassName={tileBubble} icon={<GitPullRequest size={17} />} title="Issues & pull requests" text="To understand changes" />
              <InfoRow className={`${accessRow} border-t border-[#e6ebf3]`} bubbleClassName={tileBubble} icon={<Layers size={17} />} title="Commits & code" text="To detect documentation drift" />
              <InfoRow className={`${accessRow} border-t border-[#e6ebf3]`} bubbleClassName={tileBubble} icon={<Tag size={17} />} title="Releases" text="To track product evolution" />
              <InfoRow className={`${accessRow} border-t border-[#e6ebf3]`} bubbleClassName={tileBubble} icon={<FileText size={17} />} title="Documentation files" text="To analyze and improve" />
            </>
          ) : (
            <>
              <InfoRow className={accessRow} bubbleClassName={tileBubble} icon={<Globe size={17} />} title="Public documentation" text="URLs Draftly will crawl" />
              <InfoRow className={`${accessRow} border-t border-[#e6ebf3]`} bubbleClassName={tileBubble} icon={<FileText size={17} />} title="Canonical pages" text="Discovered and indexed via Tavily" />
              <InfoRow className={`${accessRow} border-t border-[#e6ebf3]`} bubbleClassName={tileBubble} icon={<ShieldCheck size={17} />} title="No GitHub installation" text="Public pages only, read-only" />
            </>
          )}
          <div className="rounded-[9px] bg-[#f0f5ff] p-[15px] text-xs leading-[1.5] text-[#263a6f]">
            <ShieldCheck size={20} className="float-left mr-2.5 box-content rounded-lg bg-[#dce8fd] p-1.5 text-brand" />
            <b>Read-only access</b>
            <p className="mt-1.5 text-[11px] text-[#50618a]">
              Draftly never writes to your sources or repositories.
            </p>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}