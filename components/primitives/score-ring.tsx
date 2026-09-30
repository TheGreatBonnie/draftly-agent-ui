import type { ReactNode } from "react";
import type { Tone } from "./card";

const RADIUS = 51;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A single-value progress ring. The arc length is driven by `progress`
 * (0-1), so the rendered arc always reflects the score it is given.
 */
export function ScoreRing({
  progress,
  tone = "green",
  size = "h-28 w-28",
  ariaLabel,
  children,
}: {
  progress: number;
  tone?: Extract<Tone, "green" | "blue" | "violet" | "amber" | "rose" | "slate">;
  size?: string;
  ariaLabel?: string;
  children?: ReactNode;
}) {
  const fraction = Math.max(0, Math.min(1, progress));
  const arcColors: Record<string, string> = {
    green: "text-emerald-500",
    blue: "text-blue-500",
    violet: "text-violet-500",
    amber: "text-amber-500",
    rose: "text-rose-500",
    slate: "text-slate-400",
  };

  return (
    <div role="img" aria-label={ariaLabel} className={`relative mx-auto shrink-0 ${size}`}>
      <svg aria-hidden="true" className="h-full w-full -rotate-90" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="9" className="text-surface-subtle" />
        <circle
          cx="56"
          cy="56"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          className={`${arcColors[tone]} transition-[stroke-dashoffset] duration-500`}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        />
      </svg>
      {children ? <div className="absolute inset-0 grid place-items-center px-2 text-center">{children}</div> : null}
    </div>
  );
}