import type { ReactNode } from "react";

export type Tone = "blue" | "green" | "amber" | "rose" | "slate" | "violet" | "cyan";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-surface shadow-card ${className}`}>{children}</div>;
}

export function SectionTitle({ icon, title, subtitle, action }: { icon?: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="flex items-start justify-between gap-3 px-4 pt-4"><div className="flex min-w-0 gap-3">{icon && <IconTile size="sm">{icon}</IconTile>}<div className="min-w-0"><h3 className="font-semibold text-foreground">{title}</h3>{subtitle && <p className="mt-0.5 text-xs text-foreground-muted">{subtitle}</p>}</div></div>{action}</div>;
}

export function IconTile({ children, tone = "blue", size = "md", className = "" }: { children: ReactNode; tone?: Tone; size?: "sm" | "md" | "lg"; className?: string }) {
  const colors = { blue: "bg-blue-50 text-blue-600", green: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600", rose: "bg-rose-50 text-rose-600", slate: "bg-slate-100 text-slate-600", violet: "bg-violet-50 text-violet-600", cyan: "bg-cyan-50 text-cyan-600" };
  const sizes = { sm: "h-8 w-8 rounded-lg", md: "h-11 w-11 rounded-xl", lg: "h-14 w-14 rounded-2xl" };
  return <div className={`grid shrink-0 place-items-center ${sizes[size]} ${colors[tone]} ${className}`}>{children}</div>;
}

export function MetricCard({ label, value, sub, trend, tone = "blue", icon }: { label: string; value: string | number; sub: string; trend?: string; tone?: Exclude<Tone, "slate" | "cyan">; icon?: ReactNode }) {
  const colors = { blue: "bg-blue-50 text-blue-600", green: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600", rose: "bg-rose-50 text-rose-600", violet: "bg-violet-50 text-violet-600" };
  return <Card className="p-4"><div className="flex items-center gap-3"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${colors[tone]}`}>{icon}</div><div className="min-w-0 flex-1"><div className="text-xs font-medium text-slate-600">{label}</div><div className="mt-0.5 flex items-center gap-2"><strong className="text-2xl tracking-tight">{value}</strong>{trend && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">↑ {trend}</span>}</div><div className="truncate text-xs text-foreground-muted">{sub}</div></div></div></Card>;
}
