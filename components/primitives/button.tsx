import type { ReactNode } from "react";

export function Button({ children, primary = false, danger = false, className = "", onClick, type = "button", disabled = false, ariaLabel }: { children: ReactNode; primary?: boolean; danger?: boolean; className?: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean; ariaLabel?: string }) {
  return <button type={type} aria-label={ariaLabel} disabled={disabled} onClick={onClick} className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${primary ? "border-transparent bg-brand text-brand-foreground hover:brightness-110" : danger ? "border-danger/30 bg-danger-soft text-danger hover:brightness-110" : "border-border bg-surface text-foreground-secondary hover:bg-surface-subtle"} ${className}`}>{children}</button>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle: string; actions?: ReactNode }) {
  return <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h1 className="text-[27px] font-semibold tracking-tight text-foreground sm:text-[29px]">{title}</h1><p className="mt-0.5 max-w-4xl text-sm text-foreground-muted">{subtitle}</p></div>{actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}</div>;
}
