"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Bot,
  BookOpen,
  Boxes,
  Command,
  FileCheck2,
  Files,
  GitBranch,
  Grid2X2,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  Workflow,
  X,
} from "lucide-react";
import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/dashboard/theme-provider";

const nav = [
  ["Overview", "/overview", Grid2X2],
  ["Knowledge", "/knowledge", BookOpen],
  ["Reviews", "/reviews", FileCheck2],
  ["Evaluations", "/evaluations", Boxes],
  ["Documentation", "/documentation", Files],
  ["Workflows", "/workflows", Workflow],
  ["Agents", "/agents", Bot],
  ["Integrations", "/integrations", GitBranch],
  ["Settings", "/settings", Settings],
] as const;

function Logo() {
  return (
    <Link href="/" aria-label="Draftly overview" className="flex items-center">
      <Image
        src="/draftly-no-bg-logo.svg"
        alt=""
        aria-hidden="true"
        width={42}
        height={42}
        className="h-10 w-10 shrink-0 object-contain"
        priority
      />
      <span className="text-2xl font-semibold">raftly</span>
    </Link>
  );
}

function Navigation({
  path,
  onNavigate,
}: {
  path: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Primary navigation" className="space-y-1 px-3">
      {nav.map(([label, href, Icon]) => {
        const active = path === href || path.startsWith(`${href}/`);
        return (
          <Link
            onClick={onNavigate}
            href={href}
            key={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active ? "bg-blue-600 text-white shadow-sm" : "text-foreground-secondary hover:bg-surface-subtle"}`}>
            <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
            <span>{label}</span>
            {label === "Reviews" && (
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-surface text-foreground" : "bg-surface-subtle text-foreground-muted"}`}>
                12
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function AgentStatusIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 112 64"
      className="h-14 w-24 shrink-0"
      fill="none">
      <defs>
        <linearGradient id="agent-shell" x1="34" y1="25" x2="78" y2="56">
          <stop stopColor="#315FFF" />
          <stop offset="1" stopColor="#7A5CFA" />
        </linearGradient>
        <linearGradient id="agent-face" x1="42" y1="32" x2="70" y2="49">
          <stop stopColor="#546EFF" />
          <stop offset="1" stopColor="#3448D8" />
        </linearGradient>
      </defs>

      <path
        d="M28 42.5C28 31.7 37.2 23 48.5 23h15C74.8 23 84 31.7 84 42.5S74.8 62 63.5 62h-15C37.2 62 28 53.3 28 42.5Z"
        fill="#EEF2FF"
      />
      <path
        d="M34.5 43c0-8.9 7.2-16 16-16h11c8.8 0 16 7.1 16 16s-7.2 16-16 16h-11c-8.8 0-16-7.1-16-16Z"
        fill="url(#agent-shell)"
      />
      <rect x="39" y="31" width="34" height="24" rx="12" fill="white" />
      <rect
        x="43"
        y="34.5"
        width="26"
        height="17"
        rx="8.5"
        fill="url(#agent-face)"
      />
      <circle cx="50" cy="43" r="2.2" fill="white" />
      <circle cx="62" cy="43" r="2.2" fill="white" />
      <path
        d="M52.5 48c2.1 1.2 4.9 1.2 7 0"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M56 27v-4.5"
        stroke="#3D59EE"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="56" cy="20.5" r="2.5" fill="#8A63FF" />
      <path
        d="M31.5 39h-4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h4"
        stroke="#5367EC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M80.5 39h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4"
        stroke="#5367EC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      <path
        d="m22 12 1.8 4.2L28 18l-4.2 1.8L22 24l-1.8-4.2L16 18l4.2-1.8L22 12Z"
        fill="#F9BE18"
      />
      <path
        d="m84 7 1.2 2.8L88 11l-2.8 1.2L84 15l-1.2-2.8L80 11l2.8-1.2L84 7Z"
        fill="#55C9FF"
      />
      <path
        d="m99 20 1.5 3.5L104 25l-3.5 1.5L99 30l-1.5-3.5L94 25l3.5-1.5L99 20Z"
        fill="#536BFF"
      />
      <path
        d="m103 42 2.2 5.2 5.2 2.2-5.2 2.2-2.2 5.2-2.2-5.2-5.2-2.2 5.2-2.2L103 42Z"
        fill="#8259F5"
      />
      <path
        d="m10 45 1.2 2.8L14 49l-2.8 1.2L10 53l-1.2-2.8L6 49l2.8-1.2L10 45Z"
        fill="#FF7A32"
      />
    </svg>
  );
}

function useDismissibleMenu(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose]);
  return ref;
}

export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, isLoaded: userLoaded } = useUser();
  const { membership, isLoaded: organizationLoaded } = useOrganization();
  const [mobile, setMobile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [command, setCommand] = useState(false);
  const [read, setRead] = useState(false);
  const notificationRef = useDismissibleMenu(() => setNotifications(false));
  const displayName = userLoaded
    ? [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.primaryEmailAddress?.emailAddress ||
      "User"
    : "Loading...";
  const displayRole = organizationLoaded
    ? membership?.role?.replace(/^org:/, "") || "Member"
    : "Loading...";

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground lg:grid lg:grid-cols-[214px_1fr]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[214px] flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-20 items-center px-5">
          <Logo />
        </div>
        <Navigation path={path} />
        <div className="mt-auto px-5 pb-4 pt-8">
          <Link
            href="/system"
            className="flex h-40 flex-col items-center rounded-[10px] border border-violet-100 bg-gradient-to-br from-violet-50/70 via-violet-50/90 to-blue-50 px-3 pb-4 pt-3 text-center transition-colors hover:border-violet-300 dark:border-violet-900/50 dark:from-violet-950/40 dark:via-violet-950/35 dark:to-blue-950/40">
            <AgentStatusIllustration />
            <p className="mt-1.5 text-sm font-semibold leading-[19px]">
              Draftly AI Agents
              <br />
              are working for you
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
              View system status <span aria-hidden="true">→</span>
            </span>
          </Link>
          <div className="mt-5 space-y-3">
            <OrganizationSwitcher
              afterSelectOrganizationUrl="/overview"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  root: "w-full",
                  trigger:
                    "w-full justify-start gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-left hover:bg-surface-subtle",
                  organizationPreview: "min-w-0 flex-1",
                  organizationPreviewTextContainer: "min-w-0",
                  organizationName: "truncate text-sm font-medium",
                },
              }}
            />
            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2">
              <UserButton
                appearance={{ elements: { avatarBox: "h-9 w-9" } }}
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {displayName}
                </div>
                <div className="truncate text-xs capitalize text-foreground-muted">
                  {displayRole}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {mobile && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/30 lg:hidden"
          role="presentation"
          onClick={() => setMobile(false)}>
          <aside
            aria-label="Mobile navigation"
            className="h-full w-[280px] bg-surface shadow-2xl"
            onClick={(event) => event.stopPropagation()}>
            <div className="flex h-20 items-center justify-between px-5">
              <Logo />
              <button
                aria-label="Close navigation"
                onClick={() => setMobile(false)}
                className="rounded-lg p-2">
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <Navigation path={path} onNavigate={() => setMobile(false)} />
          </aside>
        </div>
      )}
      <main className="min-w-0 lg:col-start-2">
        <div className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-7">
          <div className="mx-auto flex max-w-[1380px] flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4">
            <button
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-surface lg:hidden">
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              aria-label="Open command search"
              onClick={() => setCommand(true)}
              className="relative order-5 flex h-10 basis-full min-w-0 items-center rounded-lg border border-border bg-surface pl-9 pr-3 text-left text-sm text-foreground-muted sm:order-none sm:h-9 sm:flex-1 sm:basis-auto">
              <Search aria-hidden="true" className="absolute left-3 h-4 w-4" />
              <span className="truncate">
                Search documentation, reviews, workflows...
              </span>
              <span className="ml-auto hidden items-center gap-1 rounded bg-surface-subtle px-2 py-0.5 text-[10px] text-foreground-muted sm:inline-flex">
                <Command aria-hidden="true" className="h-3 w-3" />K
              </span>
            </button>
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              className="rounded-lg p-2 text-foreground-secondary hover:bg-surface-subtle">
              <span className="sr-only">Toggle theme</span>
              {resolvedTheme === "dark" ? (
                <Sun aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Moon aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => setNotifications(!notifications)}
                aria-label={`${read ? "No unread " : "Open "}notifications`}
                aria-expanded={notifications}
                aria-haspopup="menu"
                className="relative rounded-lg p-2 text-foreground-secondary hover:bg-surface-subtle">
                <Bell aria-hidden="true" className="h-5 w-5" />
                {!read && (
                  <span
                    aria-hidden="true"
                    className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-surface"
                  />
                )}
              </button>
              {notifications && (
                <div
                  role="menu"
                  aria-label="Notifications"
                  className="absolute right-0 top-11 w-[320px] max-w-[88vw] rounded-2xl border border-border bg-surface p-3 shadow-xl">
                  <div className="flex items-center justify-between px-1 pb-2">
                    <b className="text-sm">Notifications</b>
                    <button
                      onClick={() => setRead(true)}
                      className="text-xs font-medium text-brand">
                      Mark all read
                    </button>
                  </div>
                  {[
                    [
                      FileCheck2,
                      "Review required",
                      "OAuth authentication update",
                      "2m",
                    ],
                    [
                      AlertTriangle,
                      "Evaluation failed",
                      "API rate limits documentation",
                      "18m",
                    ],
                    [
                      GitBranch,
                      "Integration issue",
                      "Discord connection lost",
                      "1h",
                    ],
                  ].map(([Icon, title, sub, time]) => (
                    <div
                      key={String(title)}
                      role="menuitem"
                      className="flex gap-3 rounded-xl p-2 hover:bg-surface-subtle">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium">
                          {String(title)}
                        </div>
                        <div className="truncate text-xs text-foreground-muted">
                          {String(sub)}
                        </div>
                      </div>
                      <span className="text-[10px] text-foreground-muted">
                        {String(time)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <UserButton
              appearance={{ elements: { avatarBox: "h-8 w-8" } }}
            />
          </div>
        </div>
        <div className="mx-auto max-w-[1380px] p-4 md:p-7">{children}</div>
      </main>
      {command && (
        <div
          className="fixed inset-0 z-[90] flex justify-center bg-slate-950/30 p-4 pt-[12vh] backdrop-blur-sm"
          role="presentation"
          onMouseDown={() => setCommand(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-title"
            className="h-fit w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}>
            <div className="relative border-b border-border">
              <Search
                aria-hidden="true"
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted"
              />
              <h2 id="command-title" className="sr-only">
                Search Draftly
              </h2>
              <input
                autoFocus
                aria-label="Search Draftly"
                placeholder="Search Draftly..."
                className="h-14 w-full bg-transparent pl-12 pr-4 outline-none"
              />
            </div>
            <div className="p-3">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
                Quick results
              </div>
              {[
                [
                  Files,
                  "OAuth 2.0 Integration",
                  "Documentation",
                  "/documentation/oauth-2-0-integration",
                ],
                [
                  FileCheck2,
                  "OAuth authentication update",
                  "Review",
                  "/reviews/oauth",
                ],
                [
                  Workflow,
                  "PR Documentation",
                  "Workflow",
                  "/workflows/pr-documentation",
                ],
                [
                  Bot,
                  "Documentation Agent",
                  "Agent",
                  "/agents/documentation-agent",
                ],
              ].map(([Icon, label, type, href]) => (
                <Link
                  onClick={() => setCommand(false)}
                  key={String(label)}
                  href={String(href)}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-surface-subtle">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{String(label)}</div>
                    <div className="text-xs text-foreground-muted">
                      {String(type)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
