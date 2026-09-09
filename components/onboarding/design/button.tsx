import { cn } from "@/lib/utils";

const btnBase =
  "flex items-center gap-[11px] rounded-[7px] border border-border bg-surface px-[15px] py-[10px] text-[13px] font-semibold text-foreground";

export function DesignButton({
  children,
  primary = false,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        btnBase,
        primary &&
          "border-brand bg-brand text-brand-foreground shadow-[0_4px_9px_#1260ed26]",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}>
      {children}
    </button>
  );
}
