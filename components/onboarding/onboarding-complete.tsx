"use client";
import { ArrowRight, CheckCircle2, FileCode2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { DesignButton } from "@/components/onboarding/design/button";

interface Props {
  documentCount?: number;
  chunkCount?: number;
}

function MetricTile({
  tone,
  icon,
  value,
  label,
}: {
  tone: string;
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <span
      className={cn(
        "flex-1 rounded-[9px] p-2.5 text-left text-[10px] text-[#4a5a80]",
        tone,
      )}>
      <i className="mb-2 grid size-[22px] place-items-center rounded-md bg-white not-italic">
        {icon}
      </i>
      <b className="mb-[3px] block text-[17px] text-[#101a43]">{value}</b>
      {label}
    </span>
  );
}

export function OnboardingComplete({ documentCount = 0, chunkCount = 0 }: Props) {
  return (
    <div className="flex min-h-[calc(100dvh-24px)] items-center justify-center text-center">
      <div className="mx-auto max-w-[620px]">
        <div className="inline-grid size-20 place-items-center rounded-full bg-[#e7f8f0] text-[#19a36d]">
          <CheckCircle2 size={44} />
        </div>
        <h1 className="mb-[11px] mt-6 text-[32px] leading-[1.2] tracking-[-1.2px] text-[#101a43]">
          Your workspace is ready
        </h1>
        <p className="text-[15px] leading-[1.55] text-[#53648e]">
          Draftly has analyzed your repository and built your knowledge
          foundation.
          <br />
          You&apos;re all set to start.
        </p>
        <div className="my-8 flex justify-center gap-2 max-[560px]:flex-col">
          <MetricTile
            tone="bg-[#eaf1ff]"
            icon={<FileCode2 size={13} className="text-brand" />}
            value={String(documentCount)}
            label="Documents"
          />
          <MetricTile
            tone="bg-[#f1eaff]"
            icon={<Layers size={13} className="text-[#7042e9]" />}
            value={chunkCount >= 1000 ? `${(chunkCount / 1000).toFixed(1)}k` : String(chunkCount)}
            label="Chunks"
          />
          <MetricTile
            tone="bg-[#e7f8f0]"
            icon={<CheckCircle2 size={13} className="text-[#19a36d]" />}
            value="Healthy"
            label="Status"
          />
        </div>
        <a href="/overview" className="mt-2 inline-block">
          <DesignButton
            primary
            className="min-w-[200px] justify-center px-[28px] py-[14px] text-[15px]">
            Go to dashboard <ArrowRight size={18} />
          </DesignButton>
        </a>
      </div>
    </div>
  );
}
