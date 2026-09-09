"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DesignButton } from "./button";

export function FooterBar({
  onBack,
  onNext,
  isNextLoading,
  isNextDisabled,
  nextLabel = "Continue",
  sticky = true,
}: {
  onBack?: () => void;
  onNext?: () => void;
  isNextLoading?: boolean;
  isNextDisabled?: boolean;
  nextLabel?: string;
  sticky?: boolean;
}) {
  return (
    <div
      className={cn(
        "z-[2] mt-[14px] flex items-center justify-between border-t border-[#e2e8f1] bg-white pt-[14px]",
        sticky && "sticky bottom-0",
      )}>
      {onBack ? (
        <DesignButton onClick={onBack}>
          <ArrowLeft size={17} /> Back
        </DesignButton>
      ) : (
        <span />
      )}
      <DesignButton
        primary
        onClick={onNext}
        disabled={isNextDisabled || isNextLoading}>
        {isNextLoading ? "Working…" : nextLabel}
        {!isNextLoading && <ArrowRight size={18} />}
      </DesignButton>
    </div>
  );
}
