"use client";

import { ChevronDown, Search } from "lucide-react";
import type { ReactNode } from "react";

export function SearchBox({ placeholder = "Search...", className = "", value, onChange }: { placeholder?: string; className?: string; value?: string; onChange?: (value: string) => void }) {
  return <div className={`relative ${className}`}><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-lg border border-border bg-input pl-9 pr-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></div>;
}

export function SelectPill({ children, className = "", onClick, ariaLabel, ariaExpanded, ariaControls }: { children: ReactNode; className?: string; onClick?: () => void; ariaLabel?: string; ariaExpanded?: boolean; ariaControls?: string }) {
  return <button type="button" aria-label={ariaLabel} aria-haspopup={ariaExpanded !== undefined ? "menu" : undefined} aria-expanded={ariaExpanded} aria-controls={ariaControls} onClick={onClick} className={`inline-flex h-10 items-center justify-between gap-3 whitespace-nowrap rounded-lg border border-border bg-surface px-3 text-sm text-foreground-secondary hover:bg-surface-subtle ${className}`}>{children}<ChevronDown aria-hidden="true" className="h-3.5 w-3.5" /></button>;
}
