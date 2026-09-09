"use client";
import { useStepGuard } from "@/lib/onboarding/use-step-guard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Eye, LockKeyhole, ShieldCheck } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { GitHubConnect } from "@/components/onboarding/github-connect";
import { Orbit } from "@/components/onboarding/design/orbit";
import { GithubIcon } from "@/components/onboarding/design/glyphs";
import {
  InfoRow,
  cardBase,
} from "@/components/onboarding/design/info-row";

const benefitRow = "py-[clamp(6px,1.35vh,13px)]";
const benefitBubble = "size-[clamp(34px,4.6vh,43px)]";

export default function GitHubPage() {
  useStepGuard("github");
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [installationId, setInstallationId] = useState<number | null>(null);

  // Setup-redirect handoff: /setup-callback lands here with
  // ?installation_id= — consume it once and clean the address bar.
  // Synchronous on purpose: must land before GitHubConnect's deferred
  // kickoff timer so the first attempt sees the pending id.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("installation_id");
    if (!raw) return;
    const parsed = Number(raw);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-time URL consumption
    if (Number.isFinite(parsed)) setInstallationId(parsed);
    window.history.replaceState({}, "", "/onboarding/github");
  }, []);

  return (
    <OnboardingShell
      currentStep="github"
      onNext={connected ? () => router.push("/onboarding/repository") : undefined}
    >
      <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col justify-center pb-1 pt-1 text-center">
        <div className="mx-auto grid size-[clamp(46px,6.2vh,58px)] place-items-center rounded-xl border border-border bg-surface shadow-[0_4px_12px_#8798b51c]">
          <GithubIcon className="size-[clamp(24px,3.2vh,30px)]" />
        </div>
        <h1 className="mb-[clamp(8px,1.5vh,14px)] mt-[clamp(10px,2.3vh,22px)] text-[clamp(24px,3.6vh,34px)] tracking-[-1.2px] text-[#101a43]">
          Connect your GitHub account
        </h1>
        <p className="m-0 text-[clamp(13px,1.75vh,16px)] leading-[1.55] text-[#53648e]">
          Install the Draftly GitHub App to read repository metadata,
          issues,
          <br /> pull requests, releases, and documentation.
        </p>
        <div
          className={`${cardBase} mx-auto mt-[clamp(12px,3.2vh,34px)] grid grid-cols-[1fr_1fr] grid-rows-[auto_auto_auto] items-center gap-x-[clamp(18px,2.8vw,32px)] gap-y-[clamp(10px,1.6vh,22px)] px-[clamp(26px,5vw,58px)] pb-[clamp(14px,2.9vh,27px)] pt-[clamp(16px,3.6vh,34px)] shadow-[0_7px_20px_#8193b51a] max-[900px]:grid-cols-1 max-[900px]:px-[25px] max-[900px]:py-7`}>
          <Orbit />
          <div className="text-left">
            <InfoRow
              className={benefitRow}
              bubbleClassName={benefitBubble}
              icon={<Eye />}
              title="Read-only access"
              text="We never modify your code or repositories."
            />
            <InfoRow
              className={benefitRow}
              bubbleClassName={benefitBubble}
              icon={<ShieldCheck />}
              title="Granular permissions"
              text="You control which repositories Draftly can access."
              tone="green"
            />
            <InfoRow
              className={benefitRow}
              bubbleClassName={benefitBubble}
              icon={<Clock3 />}
              title="Revoke anytime"
              text="Disconnect Draftly from GitHub at any time."
              tone="purple"
            />
          </div>
          <GitHubConnect
            installationId={installationId}
            onConnectedChange={setConnected}
          />
          <small className="col-span-full mt-[2px] flex items-center justify-center gap-2 text-[clamp(11px,1.5vh,13px)] text-[#647397] max-[900px]:col-auto">
            <LockKeyhole size={15} /> You&apos;ll be redirected to GitHub to
            authorize access.
          </small>
        </div>
      </div>
    </OnboardingShell>
  );
}
