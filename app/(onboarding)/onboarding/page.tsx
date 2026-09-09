"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOnboardingStatus } from "@/api/onboarding";
import { STATE_TO_STEP } from "@/lib/onboarding/constants";

export default function OnboardingEntryPage() {
  const router = useRouter();

  useEffect(() => {
    getOnboardingStatus()
      .then((status) => {
        if (status.state === "COMPLETED") {
          router.replace("/dashboard");
        } else if (status.state === "NOT_STARTED") {
          router.replace("/onboarding/welcome");
        } else {
          router.replace(`/onboarding/${STATE_TO_STEP[status.state] ?? "workspace"}`);
        }
      })
      .catch(() => {
        router.replace("/onboarding/workspace");
      });
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  );
}
