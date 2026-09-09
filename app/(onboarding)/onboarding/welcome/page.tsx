"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleHelp,
  Clock3,
  Code2,
  FileCode2,
  LockKeyhole,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/onboarding/design/side-rail";
import { ProgressStepper } from "@/components/onboarding/design/progress-stepper";
import { DesignButton } from "@/components/onboarding/design/button";
import { InfoRow, introRow } from "@/components/onboarding/design/info-row";
import { DiscordGlyph, SlackGlyph } from "@/components/onboarding/design/glyphs";

const brandTile =
  "absolute z-[1] grid size-[43px] place-items-center rounded-[9px] border border-[#dbe4f4] bg-white shadow-[0_5px_14px_#7d9de022]";

const sparkleBase = "pointer-events-none absolute z-[1] text-[10px] text-[#b0c4f0]";

export default function WelcomePage() {
  const router = useRouter();
  return (
    <main className="onboarding-theme flex h-dvh overflow-hidden bg-[#f4f7fc] p-3 font-[family-name:var(--font-jakarta)] max-[560px]:p-0">
      <div className="flex h-[calc(100dvh-24px)] w-full overflow-hidden rounded-[14px] border border-[#e1e7f0] bg-white shadow-[0_5px_22px_#cbd5e633]">
        {/* Brand panel */}
        <aside className="onboarding-brand-panel flex w-[28%] min-w-[310px] flex-col px-[38px] pb-6 pt-[28px] max-[900px]:hidden">
          <Logo />
          <div className="mt-[clamp(16px,5vh,64px)]">
            <div className="inline-flex items-center gap-[7px] rounded-lg bg-brand-soft px-[11px] py-[7px] text-xs text-brand">
              <Sparkles size={15} /> AI-Powered Documentation Engineering
            </div>
            <h1 className="mb-[clamp(10px,2vh,20px)] mt-[clamp(12px,2.4vh,26px)] text-[clamp(25px,3.4vh,32px)] leading-[1.3] tracking-[-1.2px]">
              Documentation
              <br />
              that{" "}
              <em className="bg-gradient-to-r from-[#7042e9] to-[#1260ed] bg-clip-text not-italic text-transparent">
                keeps up
              </em>{" "}
              with
              <br />
              your code
            </h1>
            <p className="m-0 text-[clamp(13px,1.8vh,15px)] leading-[1.55] text-[#53648e]">
              Draftly connects to your tools, understands your project, and
              keeps your documentation accurate, complete, and trusted.
            </p>
            <div className="mt-[clamp(8px,1.6vh,22px)] text-left">
              <InfoRow
                className="gap-[11px] py-[clamp(5px,0.9vh,10px)]"
                bubbleClassName="size-[38px] rounded-[10px] [&_svg]:w-[17px]"
                icon={<Code2 />}
                title="Understands your codebase"
                text="Analyzes PRs, issues, and commits"
              />
              <InfoRow
                className="gap-[11px] py-[clamp(5px,0.9vh,10px)]"
                bubbleClassName="size-[38px] rounded-[10px] [&_svg]:w-[17px]"
                icon={<MessageCircle />}
                title="Learns from conversations"
                text="Slack, Discord, and support chats"
              />
              <InfoRow
                className="gap-[11px] py-[clamp(5px,0.9vh,10px)]"
                bubbleClassName="size-[38px] rounded-[10px] [&_svg]:w-[17px]"
                icon={<FileCode2 />}
                title="Evaluates & improves docs"
                text="Continuous quality checks and suggestions"
              />
              <InfoRow
                className="gap-[11px] py-[clamp(5px,0.9vh,10px)]"
                bubbleClassName="size-[38px] rounded-[10px] [&_svg]:w-[17px]"
                icon={<Rocket />}
                title="Ships with confidence"
                text="Human review and safe publishing"
              />
            </div>
          </div>
          {/* Illustration */}
          <div className="relative mt-auto min-h-[170px]" aria-hidden="true">
            <svg
              className="pointer-events-none absolute inset-0 z-0 h-full w-full"
              viewBox="0 0 260 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M71 39 H160 V90 H210" stroke="#c2d0e8" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M21 89 H160 V90 H210" stroke="#c2d0e8" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M118 107 H160 V90 H210" stroke="#c2d0e8" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M45 155 H90 V90 H210" stroke="#c2d0e8" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            <div className={cn(sparkleBase, "right-[52px] top-[6px]")}>✦</div>
            <div className={cn(sparkleBase, "right-[6px] top-0 text-[7px]")}>✦</div>
            <div className={cn(sparkleBase, "right-0 top-[28px] text-[6px] opacity-50")}>✦</div>
            <div className={cn(brandTile, "left-0 top-[68px]")}>
              <SlackGlyph size={22} />
            </div>
            <div className={cn(brandTile, "left-[50px] top-[18px]")}>
              <svg viewBox="0 0 16 16" width="22" height="22" fill="var(--onboarding-github)" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <div className={cn(brandTile, "left-[96px] top-[86px]")}>
              <DiscordGlyph size={22} />
            </div>
            <div className={cn(brandTile, "left-6 top-[134px]")}>
              <span className="text-[17px] font-bold text-brand">&lt;/&gt;</span>
            </div>
            <div className="absolute bottom-1 right-4 h-[140px] w-[90px] rounded-xl bg-white px-3 py-[18px] shadow-[0_10px_25px_#7895d533]">
              <div className="h-10 rounded-md bg-[linear-gradient(135deg,#5548ed,#0877ef)]"></div>
              <i className="mt-[11px] block h-1.5 rounded-[4px] bg-[#e4e9f2]"></i>
              <i className="mt-[11px] block h-1.5 rounded-[4px] bg-[#e4e9f2]"></i>
              <i className="mt-[11px] block h-1.5 rounded-[4px] bg-[#e4e9f2]"></i>
              <b className="absolute bottom-[9px] right-[9px] flex size-[18px] items-center justify-center rounded-full bg-[#1ab27b] text-center text-xs text-white">
                ✓
              </b>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden px-[38px] pb-[22px] pt-[34px] max-[900px]:px-5 max-[900px]:py-[25px]">
          <div className="mb-1 flex flex-none items-center justify-end gap-2.5 text-[13px] text-[#45547d]">
            <span>Need help?</span>
            <CircleHelp size={16} />
            <DesignButton className="gap-1.5 px-3.5 py-[7px]">
              Contact support
            </DesignButton>
          </div>
          <div className="w-full max-w-none">
            <ProgressStepper currentSlug="welcome" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto text-center">
            <h2 className="mb-4 mt-5 text-[34px] tracking-[-1.4px] max-[560px]:text-[28px]">
              👋 Welcome to Draftly!
            </h2>
            <p className="text-[15px] text-[#53648e]">
              Let&apos;s set up your workspace and connect your project.
            </p>
            <div className="mx-auto mt-[25px] mb-auto max-w-[625px] rounded-xl border border-[#d9e1f0] bg-white px-[27px] py-[10px] text-left">
              <InfoRow
                className={introRow}
                icon={<Clock3 />}
                title="Takes about 5–10 minutes"
                text="We'll guide you through a few simple steps."
              />
              <InfoRow
                className={introRow}
                icon={<ShieldCheck />}
                title="Your data stays secure"
                text="We only access what you authorize."
                tone="green"
              />
              <InfoRow
                className={introRow}
                icon={<Sparkles />}
                title="See results early"
                text="We'll analyze your docs and show an initial health report."
                tone="purple"
              />
            </div>
            <div className="mt-[25px] flex w-full items-center justify-between border-t border-[#e2e8f1] pt-[25px] max-[900px]:items-start max-[900px]:gap-[15px] max-[560px]:flex-col">
              <span className="flex items-center gap-2.5 text-[13px] text-[#647397]">
                <LockKeyhole size={16} /> You can change these settings anytime
                from your workspace.
              </span>
              <DesignButton
                primary
                onClick={() => router.push("/onboarding/workspace")}
                className="min-w-[209px] justify-center px-[22px] py-[17px] text-base max-[560px]:w-full">
                Get started <ArrowRight size={18} />
              </DesignButton>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
