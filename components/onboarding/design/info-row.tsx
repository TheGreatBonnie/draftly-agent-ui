import { cn } from "@/lib/utils";

export function InfoRow({
  icon,
  title,
  text,
  tone = "blue",
  className,
  bubbleClassName,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tone?: "blue" | "green" | "purple";
  className?: string;
  bubbleClassName?: string;
}) {
  return (
    <div className={cn("flex items-start gap-[13px] py-[14px]", className)}>
      <div
        className={cn(
          "grid size-[42px] shrink-0 place-items-center rounded-full bg-brand-soft text-brand [&_svg]:w-5",
          tone === "green" && "bg-success-soft text-success",
          tone === "purple" && "bg-violet-soft text-violetToken",
          bubbleClassName,
        )}>
        {icon}
      </div>
      <div>
        <b className="text-sm leading-[1.4]">{title}</b>
        <p className="mt-[3px] text-xs leading-[1.55] text-foreground-secondary">
          {text}
        </p>
      </div>
    </div>
  );
}

/* Contextual recipes (were nested selectors in the design's globals.css) */
export const introRow = "border-b border-border py-4 last:border-b-0";
export const sideBubble = "size-8 rounded-full bg-surface-subtle text-foreground-secondary";
export const tileBubble =
  "size-9 rounded-[10px] bg-surface-subtle text-foreground-secondary [&_svg]:w-5";

/* Shared card recipe */
export const cardBase = "rounded-xl border border-border bg-surface";
