"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DESIGN_STEP_LABELS,
  DESIGN_STEP_NUMBER,
  DESIGN_STEP_ORDER,
  type DesignSlug,
} from "@/lib/onboarding/design-steps";

const shortVh = "[@media(max-height:820px)]";

export function ProgressStepper({ currentSlug }: { currentSlug: DesignSlug }) {
  const step = DESIGN_STEP_NUMBER[currentSlug];
  return (
    <div className="max-w-[960px] max-[900px]:mt-[30px] max-[900px]:mb-10 max-[900px]:overflow-x-auto">
      <div
        className={cn(
          "mb-7 text-center text-sm font-bold text-brand",
          shortVh && "mb-3.5",
        )}>
        Step {step} of 8
      </div>
      <div className="flex max-[900px]:min-w-[700px]">
        {DESIGN_STEP_ORDER.map((slug, i) => {
          const n = i + 1;
          return (
            <div
              className="relative grid flex-1 grid-cols-[30px_1fr] grid-rows-[30px_auto] text-center"
              key={slug}>
              <div
                className={cn(
                  "z-[1] mx-auto grid size-[30px] place-items-center rounded-full border border-[#cfd8e8] bg-white text-[13px] text-[#51628d]",
                  n < step && "border-[#9bddbb] bg-[#ecfbf3] text-[#31a467]",
                  n === step && "border-brand bg-brand text-white",
                )}>
                {n < step ? <Check size={16} /> : n}
              </div>
              {i < DESIGN_STEP_ORDER.length - 1 && (
                <div
                  className={cn(
                    "absolute left-1/2 right-[-50%] top-[15px] h-px bg-[#d6ddea]",
                    n < step && "bg-brand",
                  )}
                />
              )}
              <span
                className={cn(
                  "col-start-1 row-start-2 mt-[17px] justify-self-center whitespace-nowrap text-xs text-[#50618a]",
                  shortVh && "",
                  "max-[560px]:text-[10px]",
                  n === step && "font-bold text-brand",
                )}>
                {DESIGN_STEP_LABELS[slug]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
