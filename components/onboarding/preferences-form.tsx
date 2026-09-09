"use client";
import { useState } from "react";
import {
  FileText,
  Code2,
  MessageCircle,
  Pencil,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  CalendarClock,
  LockKeyhole,
  ArrowRight,
  Check,
} from "lucide-react";
import { validateDocStyle, validateReviewPolicy } from "@/lib/onboarding/validation";
import { useStepDraft } from "@/lib/onboarding/use-draft";
import { cn } from "@/lib/utils";
import { DesignButton } from "@/components/onboarding/design/button";
import { InfoRow, sideBubble, cardBase } from "@/components/onboarding/design/info-row";

interface Props {
  onSubmit: (style: string, reviewPolicy: string, autoPublish: boolean, automation: boolean[]) => void;
  loading?: boolean;
}

const secHead = "mb-1 mt-[27px] flex items-center gap-3 text-base text-[#101a43]";
const secIcon = "grid size-[38px] shrink-0 place-items-center rounded-full p-2";
const secSub = "mb-3 ml-[50px] text-xs text-[#53648e] max-[900px]:ml-0";

const STYLE_OPTIONS = [
  {
    value: "technical",
    label: "Technical",
    desc: "Detailed, formal, and comprehensive.",
    icon: <FileText size={16} />,
  },
  {
    value: "developer-focused",
    label: "Developer-focused",
    desc: "Clear, practical, and easy to implement.",
    icon: <Code2 size={16} />,
  },
  {
    value: "conversational",
    label: "Conversational",
    desc: "Friendly, approachable, and easy to read.",
    icon: <MessageCircle size={16} />,
  },
];

const REVIEW_OPTIONS = [
  {
    value: "always",
    label: "Always require review",
    desc: "All documentation changes require human approval.",
  },
  {
    value: "medium-high",
    label: "Review medium & high risk",
    desc: "Only medium and high risk changes need review.",
  },
  {
    value: "auto-low",
    label: "Auto-publish low risk",
    desc: "Low risk changes are published automatically.",
  },
];

const AUTOMATION_OPTIONS = [
  { label: "Detect documentation drift", desc: "Monitor code and docs for gaps" },
  { label: "Evaluate documentation", desc: "Run quality checks automatically" },
  { label: "Suggest improvements", desc: "Create suggestions and PRs" },
  { label: "Reply to questions", desc: "Answer in Slack & Discord" },
  { label: "Auto-publish low risk changes", desc: "Publish changes that are safe" },
];

function RadioDot({ on, size = "size-4" }: { on: boolean; size?: string }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full border-[1.5px] border-[#b7c5da]",
        size,
        on && "border-brand",
      )}>
      <span
        className={cn(
          "size-[9px] rounded-full bg-brand",
          on ? "opacity-100" : "opacity-0",
        )}
      />
    </span>
  );
}

export function PreferencesForm({ onSubmit, loading = false }: Props) {
  const [draft, setDraft] = useStepDraft("preferences", {
    style: "developer-focused",
    reviewPolicy: "always",
    autoPublish: false,
    automation: [true, true, true, true, false] as boolean[],
  });
  const [error, setError] = useState<string | null>(null);

  const { style, reviewPolicy, autoPublish, automation } = draft;

  function updateAutomation(index: number) {
    setDraft({
      ...draft,
      automation: automation.map((v: boolean, i: number) => (i === index ? !v : v)),
    });
  }

  function handleSubmit() {
    const styleErr = validateDocStyle(style);
    if (styleErr) {
      setError(styleErr);
      return;
    }
    const policyErr = validateReviewPolicy(reviewPolicy);
    if (policyErr) {
      setError(policyErr);
      return;
    }
    setError(null);
    onSubmit(style, reviewPolicy, autoPublish, automation);
  }

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-[35px] max-[900px]:grid-cols-1">
        <div>
          {/* Documentation Style */}
          <h3 className={secHead}>
            <span className={cn(secIcon, "bg-[#f1eaff] text-[#7042e9]")}>
              <Pencil />
            </span>{" "}
            Documentation style
          </h3>
          <p className={secSub}>How Draftly writes and improves documentation.</p>
          <div className="ml-[50px] grid grid-cols-3 gap-[13px] max-[900px]:ml-0 max-[900px]:grid-cols-1">
            {STYLE_OPTIONS.map(({ value, label, desc, icon }) => {
              const selected = style === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setDraft({ ...draft, style: value })}
                  className={cn(
                    "min-h-[102px] rounded-[9px] border border-[#d9e1f0] bg-white p-[14px] text-left [@media(max-height:820px)]:min-h-[84px]",
                    selected && "border-brand bg-[#eef4ff] shadow-[0_0_0_1px_#1260ed44]",
                  )}>
                  <span className="mb-2.5 flex items-center justify-between">
                    <span className="grid place-items-center text-[#44507a]">{icon}</span>
                    <RadioDot on={selected} />
                  </span>
                  <b className="block text-xs text-[#101a43]">{label}</b>
                  <small className="mt-2 block text-xs leading-[1.5] text-[#53648e]">
                    {desc}
                  </small>
                </button>
              );
            })}
          </div>

          {/* Review Policy */}
          <h3 className={secHead}>
            <span className={cn(secIcon, "bg-[#e7f8f0] text-[#19a36d]")}>
              <ShieldCheck />
            </span>{" "}
            Review policy
          </h3>
          <p className={secSub}>Choose when human review is required.</p>
          <div
            role="radiogroup"
            aria-label="Review policy"
            className="ml-[50px] grid grid-cols-3 gap-[13px] max-[900px]:ml-0 max-[900px]:grid-cols-1"
          >
            {REVIEW_OPTIONS.map(({ value, label, desc }) => {
              const selected = reviewPolicy === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setDraft({ ...draft, reviewPolicy: value })}
                  className={cn(
                    "min-h-[102px] rounded-[9px] border border-[#d9e1f0] bg-white p-[14px] text-left [@media(max-height:820px)]:min-h-[84px]",
                    selected && "border-brand bg-[#eef4ff] shadow-[0_0_0_1px_#1260ed44]",
                  )}>
                  <span className="mb-2.5 flex items-center justify-between">
                    <RadioDot on={selected} />
                    <RadioDot on={selected} />
                  </span>
                  <b className="block text-xs text-[#101a43]">{label}</b>
                  <small className="mt-2 block text-xs leading-[1.5] text-[#53648e]">
                    {desc}
                  </small>
                </button>
              );
            })}
          </div>

          {/* Automation */}
          <h3 className={secHead}>
            <span className={cn(secIcon, "bg-[#fef3e8] text-[#e8742a]")}>
              <Zap />
            </span>{" "}
            Automation
          </h3>
          <p className={secSub}>Control what Draftly automatically does for you.</p>
          <div className="ml-[50px] grid grid-cols-3 overflow-hidden rounded-lg border border-[#d9e1f0] bg-white max-[900px]:ml-0 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {AUTOMATION_OPTIONS.map(({ label, desc }, i) => {
              const on = automation[i];
              return (
                <button
                  key={label}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => updateAutomation(i)}
                  className={cn(
                    "min-h-[69px] border-b border-r border-[#d9e1f0] bg-white p-3 text-left",
                    (i % 3 === 2 || (i === automation.length - 1 && i % 3 === 1)) && "border-r-0",
                    i >= 3 && "border-b-0",
                  )}>
                  <span
                    className={cn(
                      "mr-1.5 inline-grid size-[15px] place-items-center rounded-[3px] border border-[#afbdd3]",
                      on && "border-brand bg-brand text-white",
                    )}>
                    {on && <Check size={12} />}
                  </span>
                  <b className="text-[11px] text-[#101a43]">{label}</b>
                  <small className="ml-[21px] mt-[5px] block text-[11px] text-[#53648e]">
                    {desc}
                  </small>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className={cn(cardBase, "px-5 py-[22px] max-[900px]:order-2")}>
          <h3 className="mb-4 text-base text-[#101a43]">What this means</h3>
          <InfoRow
            className="py-[10px]"
            bubbleClassName={sideBubble}
            icon={<Sparkles />}
            title="Draftly becomes your doc assistant"
            text="We'll watch your project, conversations, and docs to keep everything accurate."
            tone="purple"
          />
          <InfoRow
            className="border-t border-[#e6ebf3] py-[10px]"
            bubbleClassName={sideBubble}
            icon={<Users />}
            title="You stay in control"
            text="Important changes go through review so your docs stay trustworthy."
            tone="purple"
          />
          <InfoRow
            className="border-t border-[#e6ebf3] py-[10px]"
            bubbleClassName={sideBubble}
            icon={<CalendarClock />}
            title="Works in the background"
            text="Draftly runs continuously and keeps your docs up to date."
            tone="green"
          />
          <div className="mt-[10px] rounded-[9px] border border-[#e7dcfb] bg-[#f7f3ff] p-[15px] text-xs leading-[1.5] text-[#263a6f]">
            <LockKeyhole
              size={20}
              className="float-left mr-2.5 box-content size-[18px] rounded-lg bg-[#7042e9] p-1.5 text-white"
            />
            <b className="text-[#3b56d8]">We respect your data</b>
            <p className="mt-1.5 text-[11px] text-[#50618a]">
              We only access what you connect and never train on your private data.
            </p>
            <span className="clear-both mt-[9px] flex items-center gap-[5px] text-[11px] font-bold text-[#7042e9]">
              Learn more about privacy <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p aria-live="polite" className="mt-3 text-[11px] text-red-500">
          {error}
        </p>
      )}
      <DesignButton primary className="mt-[22px]" disabled={loading} onClick={handleSubmit}>
        Continue
      </DesignButton>
    </div>
  );
}
