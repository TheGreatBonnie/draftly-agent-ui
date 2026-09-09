"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

export function RangeMenu({ value, options, onChange, label, calendar = false, compact = false }: { value: string; options: readonly string[]; onChange: (value: string) => void; label: string; calendar?: boolean; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);
  return <div ref={ref} className="relative shrink-0">
    <button type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} className={`inline-flex max-w-full items-center whitespace-nowrap rounded-lg border border-border bg-surface font-medium text-foreground-secondary hover:bg-surface-subtle ${compact ? "h-8 gap-2 px-3 text-[11px]" : "h-10 gap-3 px-3 text-sm"}`}>
      {calendar && <CalendarDays aria-hidden="true" className="h-4 w-4" />}<span className="truncate">{value}</span><span aria-hidden="true">⌄</span>
    </button>
    {open && <div role="menu" aria-label={label} className="absolute right-0 top-11 z-20 min-w-[190px] rounded-xl border border-border bg-surface p-1 shadow-xl">{options.map((option) => <button type="button" role="menuitem" key={option} onClick={() => { onChange(option); setOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${option === value ? "bg-brand-soft font-medium text-brand" : "text-foreground-secondary hover:bg-surface-subtle"}`}>{option}</button>)}</div>}
  </div>;
}
