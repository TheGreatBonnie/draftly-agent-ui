import { BookOpen, Code2, GitBranch, GitFork } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";

/* Orbit satellite chip (was .orbit > svg:nth-child(n) in the design CSS) */
const orbitChip =
  "absolute box-content rounded-full border border-[#cfe0ff] p-[clamp(5px,0.85vh,8px)]";

function Sparkle({
  className,
  size = 14,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={cn("pointer-events-none absolute opacity-90", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#b7c4dc"
      strokeWidth="2.4">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  );
}

export function Orbit() {
  return (
    <div className="relative mx-auto grid aspect-square h-[clamp(148px,23.5vh,250px)] place-items-center rounded-full border border-[#dbe6ff] text-brand before:absolute before:inset-[clamp(20px,3.4vh,40px)] before:rounded-full before:border before:border-[#dbe6ff] before:content-[''] max-[900px]:h-[230px]">
      <Code2
        size={28}
        className={cn(
          orbitChip,
          "-top-[17px] left-1/2 -translate-x-1/2 bg-[#eef4ff] text-[#1260ed]",
        )}
      />
      <div className="z-[1] grid size-[clamp(64px,10.4vh,104px)] place-items-center rounded-full bg-white shadow-[0_7px_20px_#7289b52b]">
        <BrandMark size={46} />
      </div>
      <GitBranch
        size={28}
        className={cn(
          orbitChip,
          "left-[-17px] top-[calc(50%-17px)] bg-[#f3edff] text-[#7042e9]",
        )}
      />
      <BookOpen
        size={28}
        className={cn(
          orbitChip,
          "right-[-17px] top-[calc(50%-17px)] bg-[#e9faf3] text-[#18a978]",
        )}
      />
      <GitFork
        size={28}
        className={cn(
          orbitChip,
          "bottom-[-17px] left-1/2 -translate-x-1/2 bg-[#fef3e8] text-[#e8742a]",
        )}
      />
      <Sparkle className="left-[62%] top-[8%]" size={16} />
      <Sparkle className="left-[6%] top-[32%]" size={13} />
      <Sparkle className="bottom-[18%] right-[12%]" size={14} />
      <Sparkle className="bottom-[8%] left-[28%]" size={11} />
    </div>
  );
}
