"use client";

import { Show } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();
  const themeLabel = resolvedTheme === "dark" ? "light" : "dark";

  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border border-border bg-surface p-2 text-foreground transition hover:bg-surface-secondary"
      aria-label={`Switch to ${themeLabel} mode`}>
      {resolvedTheme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );

  return (
    <header className="relative z-50 bg-transparent">
      <div className="container-draftly flex h-[70px] items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-[1.45rem] font-extrabold tracking-[-0.04em]">
          <Image
            src="/draftly-no-bg-logo.svg"
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            className="size-9 shrink-0 object-contain"
            priority
          />

          <span>raftly</span>
        </Link>

        <nav className="hidden items-center gap-12 md:flex">
          <Link
            href="#product"
            className="flex items-center gap-1 text-xs font-bold text-foreground transition hover:text-primary">
            Product
            <ChevronDown className="size-3 text-primary" />
          </Link>

          <Link
            href="#how-it-works"
            className="text-xs font-bold text-foreground transition hover:text-primary">
            How it works
          </Link>

          <Link
            href="#integrations"
            className="text-xs font-bold text-foreground transition hover:text-primary">
            Integrations
          </Link>

          <Link
            href="#resources"
            className="flex items-center gap-1 text-xs font-bold text-foreground transition hover:text-primary">
            Resources
            <ChevronDown className="size-3 text-primary" />
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {themeToggle}
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 text-xs font-bold text-foreground transition hover:bg-surface-secondary">
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-[7px] bg-[#4338f2] px-5 py-3 text-xs font-bold text-white shadow-[0_10px_28px_rgba(67,56,242,0.25)] transition hover:opacity-90">
              Start building
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="rounded-[7px] bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-[0_10px_28px_rgba(67,56,242,0.25)] transition hover:opacity-90">
              Dashboard
            </Link>
          </Show>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {themeToggle}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-border bg-surface p-2 text-foreground"
            aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-draftly flex flex-col gap-5 py-6">
            <Link href="#product">Product</Link>
            <Link href="#how-it-works">How it works</Link>
            <Link href="#integrations">Integrations</Link>
            <Link href="#resources">Resources</Link>

            <Show when="signed-out">
              <Link
                href="/sign-up"
                className="rounded-lg bg-[#4338f2] px-4 py-3 text-center text-sm font-medium text-white">
                Start building
              </Link>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="rounded-lg bg-foreground px-4 py-3 text-center text-sm font-medium text-background">
                Dashboard
              </Link>
            </Show>
          </nav>
        </div>
      )}
    </header>
  );
}
