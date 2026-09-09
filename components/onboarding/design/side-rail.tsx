"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  FolderOpen,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DESIGN_STEP_LABELS,
  DESIGN_STEP_NUMBER,
  DESIGN_STEP_ORDER,
  type DesignSlug,
} from "@/lib/onboarding/design-steps";

const shortVh = "[@media(max-height:820px)]";

/* Per-step subtitle copy, keyed by the step being VIEWED (from the design). */
const CURRENT_SUBS: Record<DesignSlug, string> = {
  welcome: "Let's get you started",
  workspace: "Name your workspace",
  github: "Connect your GitHub account",
  repository: "Choose the project to manage",
  documentation: "We'll find your documentation",
  integrations: "Bring in conversations and signals",
  preferences: "Set your preferences",
  initialize: "Almost there!",
};

const DONE_SUBS: Record<DesignSlug, string> = {
  welcome: "Let's get you started",
  workspace: "Your workspace is ready",
  github: "GitHub account connected",
  repository: "TheGreatBonnie / authly",
  documentation: "27 sources found",
  integrations: "Slack, Discord connected",
  preferences: "Set your preferences",
  initialize: "Almost there!",
};

const FUTURE_SUBS: Record<DesignSlug, string> = {
  welcome: "Let's get you started",
  workspace: "Name your workspace",
  github: "Connect your GitHub account",
  repository: "Choose the project to manage",
  documentation: "We'll find your documentation",
  integrations: "Slack, Discord and more",
  preferences: "Set your preferences",
  initialize: "You're almost ready",
};

export function Logo() {
  return (
    <div className="flex items-center text-[27px] tracking-[-1px] text-[#101a43]">
      <Image
        src="/draftly-no-bg-logo.svg"
        alt=""
        aria-hidden="true"
        width={34}
        height={34}
        className="h-[34px] w-[34px] shrink-0 object-contain"
        priority
      />
      <strong>raftly</strong>
    </div>
  );
}

export function SideRail({ currentSlug }: { currentSlug: DesignSlug }) {
  const router = useRouter();
  const step = DESIGN_STEP_NUMBER[currentSlug];
  const railSubs = DESIGN_STEP_ORDER.map((slug) => {
    const n = DESIGN_STEP_NUMBER[slug];
    if (n < step) return DONE_SUBS[slug];
    if (n === step) return CURRENT_SUBS[slug];
    return FUTURE_SUBS[slug];
  });

  const [note] = useState(() => {
    switch (currentSlug) {
      case "workspace":
        return {
          icon: <FolderOpen size={18} />,
          title: "Your workspace, your rules",
          text: "Name your workspace and give it a description. You can change these later.",
          link: false,
        };
      case "github":
        return {
          icon: <LockKeyhole size={18} />,
          title: "Your data is secure",
          text: "We only access what you authorize. You can disconnect anytime.",
          link: true,
        };
      case "repository":
        return {
          icon: <Sparkles size={18} />,
          title: "Why we need a repository",
          text: "Draftly analyzes your codebase, issues, pull requests, and docs to keep your documentation accurate and up to date.",
          link: false,
        };
      case "documentation":
        return {
          icon: <Sparkles size={18} />,
          title: "We'll do the heavy lifting",
          text: "Draftly will scan your repository, detect documentation, and understand how everything fits together.",
          link: false,
        };
      default:
        return {
          icon: <ShieldCheck size={18} />,
          title: "Your data is private",
          text: "We only access the sources and channels you choose. You can edit or disconnect them anytime.",
          link: true,
        };
    }
  });

  return (
    <aside className="flex h-full w-[288px] flex-none flex-col overflow-y-auto border-r border-[#e2e8f0] bg-[#f8fafc] px-6 py-8 max-[900px]:hidden">
      <Logo />
      <p
        className={cn(
          "mb-[22px] mt-[45px] text-xs font-bold text-[#45547d]",
          shortVh && "mb-3 mt-5",
        )}>
        ONBOARDING
      </p>
      <div className="flex flex-col">
        {DESIGN_STEP_ORDER.map((slug, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <button
              key={slug}
              className={cn(
                "relative flex gap-3.5 rounded-[9px] px-2 py-[9px] text-left text-[#101a43]",
                current && "bg-[#eef4ff] ring-1 ring-[#d3e0ff]",
              )}
              onClick={() => router.push(`/onboarding/${slug}`)}>
              {i < DESIGN_STEP_ORDER.length - 1 && (
                <span className="absolute left-[23px] top-[39px] h-[31px] w-px bg-[#cbd8ef]" />
              )}
              <div
                className={cn(
                  "z-[1] grid size-[30px] shrink-0 place-items-center rounded-full border border-[#c8d3e6] bg-white text-sm",
                  done && "border-success bg-success text-white",
                  current && "border-brand bg-brand text-white",
                )}>
                {done ? <Check size={15} /> : n}
              </div>
              <div>
                <b className="mb-[5px] mt-1 block text-sm">
                  {DESIGN_STEP_LABELS[slug]}
                </b>
                <small className="block text-xs text-[#51628d]">
                  {railSubs[i]}
                </small>
              </div>
            </button>
          );
        })}
      </div>
      <div
        className={cn(
          "mt-auto flex gap-3 rounded-[10px] border border-[#dce5f4] bg-white/60 p-[17px] leading-[1.6] text-[#17224c]",
          shortVh && "p-3",
        )}>
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-[11px] bg-brand-soft text-brand",
            step >= 7 && "rounded-full",
          )}>
          {step >= 7 ? <Sparkles size={18} /> : note.icon}
        </div>
        <div>
          <b className="text-sm">{note.title}</b>
          <p className="my-[5px] text-xs text-[#51628d]">{note.text}</p>
          {note.link && (
            <a className="flex cursor-pointer items-center gap-[5px] text-xs font-bold text-brand">
              Learn more <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
