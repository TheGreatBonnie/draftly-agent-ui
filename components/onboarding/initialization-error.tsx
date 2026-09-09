"use client";
import { AlertTriangle } from "lucide-react";
import { DesignButton } from "@/components/onboarding/design/button";

interface Props {
  failure: { step: string; detail: string } | null;
  onRetry: () => void;
}

export function InitializationError({ failure, onRetry }: Props) {
  return (
    <div className="max-w-[640px] rounded-[9px] border border-red-200 bg-red-50 p-[15px] text-xs leading-[1.5] text-red-700">
      <div className="flex items-center gap-2">
        <AlertTriangle size={20} className="box-content rounded-lg bg-red-600 p-1.5 text-white" />
        <b className="text-sm">Initialization Failed</b>
      </div>
      {failure && (
        <p className="mt-2 text-[11px] text-red-500">{failure.detail}</p>
      )}
      <DesignButton
        onClick={onRetry}
        className="mt-3 border-red-200 bg-white text-red-600">
        Retry
      </DesignButton>
    </div>
  );
}
