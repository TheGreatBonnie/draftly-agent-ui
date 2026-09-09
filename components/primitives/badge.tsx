import type { ReactNode } from "react";
import type { Tone } from "./card";

export function Badge({ children, tone = "blue" }: { children: ReactNode; tone?: Tone }) {
  const colors = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", rose: "bg-rose-50 text-rose-700", slate: "bg-slate-100 text-slate-600", violet: "bg-violet-50 text-violet-700", cyan: "bg-cyan-50 text-cyan-700" };
  return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium dark:text-foreground ${colors[tone]}`}>{children}</span>;
}

export function Progress({ value, tone = "green" }: { value: number; tone?: "green" | "blue" | "violet" | "amber" | "rose" }) {
  const colors = { green: "bg-emerald-500", blue: "bg-blue-500", violet: "bg-violet-500", amber: "bg-amber-500", rose: "bg-rose-500" };
  return <div className="h-2 overflow-hidden rounded-full bg-surface-subtle"><div className={`h-full rounded-full transition-all ${colors[tone]}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}
