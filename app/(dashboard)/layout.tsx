// import "./globals.css";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { AuthTokenSetter } from "@/components/dashboard/auth-token-setter";
import { AppShell } from "@/components/layout";
import { ThemeProvider } from "@/components/theme";

export const metadata: Metadata = {
  title: "Draftly",
  description: "Autonomous documentation engineering dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();
  return (
    <>
      <AuthTokenSetter />
      <ThemeProvider>
        <AppShell>{children}</AppShell>
      </ThemeProvider>
    </>
  );
}
