"use client";
import { useEffect, useMemo, useState } from "react";
import { discoverDocumentation } from "@/api/onboarding";
import { BookOpen, Braces, FileText, History, ShieldCheck, SquareCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepDraft } from "@/lib/onboarding/use-draft";
import {
  InfoRow,
  cardBase,
  tileBubble,
} from "@/components/onboarding/design/info-row";
import { DesignButton } from "@/components/onboarding/design/button";
import type { DiscoveryResult } from "@/lib/onboarding/types";

interface Props {
  onConfirm: (include: string[], exclude: string[]) => void;
  loading?: boolean;
}

const formLabel = "mb-[9px] mt-[22px] block text-[13px] font-bold text-[#101a43]";

export function DocumentationSources({ onConfirm, loading = false }: Props) {
  const [discovery, setDiscovery] = useState<DiscoveryResult | null>(null);
  const [excludedList, setExcludedList] = useStepDraft<string[]>("documentation", []);
  const [discoveryLoading, setDiscoveryLoading] = useState(true);
  const excluded = useMemo(() => new Set(excludedList), [excludedList]);

  useEffect(() => {
    discoverDocumentation()
      .then(setDiscovery)
      .catch(() => setDiscovery(null))
      .finally(() => setDiscoveryLoading(false));
  }, []);

  if (discoveryLoading)
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-[#53648e]">
        <span className="size-4 animate-spin rounded-full border-2 border-dotted border-[#814ef0]" />
        Discovering documentation...
      </div>
    );
  if (!discovery)
    return <p className="py-8 text-sm text-red-500">Failed to discover documentation.</p>;

  function toggle(path: string) {
    setExcludedList(
      excludedList.includes(path)
        ? excludedList.filter((p) => p !== path)
        : [...excludedList, path],
    );
  }

  const include = discovery.candidates.filter((p) => !excluded.has(p));
  const exclude = [...excluded];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-[35px] max-[900px]:grid-cols-1">
      <div>
        <label className={formLabel}>
          Documentation directory (recommended){""}
          <span className="ml-1 font-normal text-[#71809b]">ⓘ</span>
        </label>
        <div className="flex items-center justify-between gap-2.5 rounded-lg border border-[#cdd8ea] px-[13px] py-[11px] text-[#657494]">
          docs/ <FileText size={18} />
        </div>
        <label className={formLabel}>
          Include in scan{" "}
          <span className="text-[11px] font-medium text-[#32ae70]">
            {discovery.count} found
          </span>
        </label>
        <div className="max-h-72 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3.5 max-[900px]:grid-cols-1 max-[560px]:grid-cols-1">
            {discovery.candidates.map((path) => {
              const checked = !excluded.has(path);
              return (
                <button
                  key={path}
                  type="button"
                  aria-pressed={!excluded.has(path)}
                  aria-label={`${!excluded.has(path) ? "Exclude" : "Include"} ${path}`}
                  onClick={() => toggle(path)}
                  className={cn(
                    "rounded-[9px] border border-[#d9e1f0] bg-white p-[13px] text-left",
                    checked && "border-[#a9c3ff] bg-[#f4f7ff]",
                  )}>
                  <span
                    className={cn(
                      "float-left mr-2 grid size-[15px] place-items-center rounded-[3px] border border-[#b7c5da]",
                      checked && "border-brand bg-brand text-white",
                    )}>
                    {checked && (
                      <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2.5 6.5l2.5 2.5L9.5 4" />
                      </svg>
                    )}
                  </span>
                  <b className="flex items-center gap-[7px] text-xs text-[#101a43]">
                    <i className="inline-flex shrink-0 not-italic text-brand">
                      <FileText size={15} />
                    </i>
                    {path.split("/").pop()}
                  </b>
                  <small className="mt-1.5 flex items-center gap-1.5 text-xs text-[#53648e]">
                    {path}
                  </small>
                </button>
              );
            })}
          </div>
        </div>
        <DesignButton
          primary
          className="mt-[22px]"
          disabled={loading}
          onClick={() => onConfirm(include, exclude)}>
          Confirm sources
        </DesignButton>
      </div>
      <div className={`${cardBase} px-5 py-[22px] max-[900px]:order-2`}>
        <h3 className="mb-2 text-base text-[#101a43]">What we&apos;ll discover</h3>
        <InfoRow
          className="py-[7px]"
          bubbleClassName={tileBubble}
          icon={<FileText size={17} />}
          title="Documentation files"
          text="Markdown, guides, references"
        />
        <InfoRow
          className="border-t border-[#e6ebf3] py-[7px]"
          bubbleClassName={tileBubble}
          icon={<Braces size={17} />}
          title="API references"
          text="OpenAPI, endpoints, schemas"
        />
        <InfoRow
          className="border-t border-[#e6ebf3] py-[7px]"
          bubbleClassName={tileBubble}
          icon={<BookOpen size={17} />}
          title="Architecture docs"
          text="Diagrams, ADRs, design docs"
        />
        <InfoRow
          className="border-t border-[#e6ebf3] py-[7px]"
          bubbleClassName={tileBubble}
          icon={<SquareCode size={17} />}
          title="Examples & tutorials"
          text="Usage, code examples, how-tos"
        />
        <InfoRow
          className="border-t border-[#e6ebf3] py-[7px]"
          bubbleClassName={tileBubble}
          icon={<History size={17} />}
          title="Changelogs"
          text="Releases and version history"
        />
        <div className="rounded-[9px] bg-[#f0f5ff] p-[15px] text-xs leading-[1.5] text-[#263a6f]">
          <ShieldCheck
            size={20}
            className="float-left mr-2.5 box-content rounded-lg bg-[#dce8fd] p-1.5 text-brand"
          />
          <b>Safe & read-only</b>
          <p className="mt-1.5 text-[11px] text-[#50618a]">
            Draftly never writes to your repository. We only read content
            you&apos;ve authorized.
          </p>
        </div>
      </div>
    </div>
  );
}
