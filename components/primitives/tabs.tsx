"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type TabItem = string | { label: string; href?: string; count?: number };

export function Tabs({ items, active, className = "" }: { items: TabItem[]; active: string; className?: string }) {
  const [selected, setSelected] = useState(active);
  const normalized = useMemo(() => items.map((item) => typeof item === "string" ? { label: item } : item), [items]);
  return <div className={`relative min-w-0 border-b border-border ${className}`}><div className="flex max-w-full gap-1 overflow-x-auto overscroll-x-contain scroll-smooth px-0 scrollbar-none" role="tablist" aria-label="Page sections">{normalized.map((item) => { const isActive = item.href ? item.label === active : item.label === selected; const classes = `inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition ${isActive ? "border-brand font-medium text-brand" : "border-transparent text-foreground-muted hover:text-foreground"}`; return item.href ? <Link key={item.label} href={item.href} className={classes}>{item.label}{item.count !== undefined && <span className="rounded-full bg-surface-subtle px-1.5 py-0.5 text-[10px] text-foreground-muted">{item.count}</span>}</Link> : <button key={item.label} role="tab" aria-selected={isActive} onClick={() => setSelected(item.label)} className={classes}>{item.label}{item.count !== undefined && <span className="rounded-full bg-surface-subtle px-1.5 py-0.5 text-[10px] text-foreground-muted">{item.count}</span>}</button>; })}</div><div className="pointer-events-none absolute right-0 top-0 h-10 w-8 bg-gradient-to-l from-surface to-transparent sm:hidden" /></div>;
}

export function TinyLink({ children, href }: { children: ReactNode; href?: string }) {
  const className = "inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand";
  return href ? <Link href={href} className={className}>{children}<ArrowUpRight aria-hidden="true" className="h-3 w-3" /></Link> : <button className={className}>{children}<ArrowUpRight aria-hidden="true" className="h-3 w-3" /></button>;
}
