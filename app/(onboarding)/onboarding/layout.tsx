import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { AuthTokenSetter } from "@/components/dashboard/auth-token-setter";
import "../../globals.css";

export const metadata: Metadata = { title: "Draftly — Onboarding" };

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();
  return (
    <>
      <AuthTokenSetter />
      <div className="onboarding-theme min-h-screen bg-[#f4f7fc] font-[family-name:var(--font-jakarta)]">
        {children}
      </div>
    </>
  );
}
