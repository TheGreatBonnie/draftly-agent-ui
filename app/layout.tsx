import "./globals.css";
import { AppShell } from "@/components/layout";
import { ThemeProvider } from "@/components/theme";
import { THEME_SCRIPT } from "@/lib/theme/theme-script";
import { ClerkProvider } from "@clerk/nextjs";
export const metadata = {
  title: "Draftly",
  description: "Autonomous documentation engineering dashboard",
  icons: {
    icon: "/draftly-no-bg-logo.svg",
    apple: "/draftly-no-bg-logo.svg",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <ClerkProvider afterSignOutUrl="/">
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
