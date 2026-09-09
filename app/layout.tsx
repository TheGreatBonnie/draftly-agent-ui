import "./globals.css";
import { AppShell } from "@/components/layout";
import { ThemeProvider } from "@/components/theme";
import { ClerkProvider } from "@clerk/nextjs";
export const metadata = {
  title: "Draftly",
  description: "Autonomous documentation engineering dashboard",
  icons: {
    icon: "/draftly-no-bg-logo.svg",
    apple: "/draftly-no-bg-logo.svg",
  },
};
const themeScript = `(function(){try{var t=localStorage.getItem('draftly-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})()`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ClerkProvider afterSignOutUrl="/">
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
