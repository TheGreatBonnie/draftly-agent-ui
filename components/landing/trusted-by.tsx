import {
  BadgeCheck,
  CircleDot,
  CloudCog,
  Gem,
  Hexagon,
  Sparkle,
  type LucideIcon,
} from "lucide-react";

const sources: { name: string; icon: LucideIcon }[] = [
  { name: "Nebula", icon: Sparkle },
  { name: "Stackline", icon: Hexagon },
  { name: "Orbit", icon: CircleDot },
  { name: "Moneta", icon: Gem },
  { name: "Pingora", icon: CloudCog },
  { name: "Devtron", icon: BadgeCheck },
];

export function TrustedBy() {
  return (
    <section className="rounded-t-[12px] border-y border-border/80 bg-white/88">
      <div className="container-draftly py-6">
        <p className="text-center text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-foreground">
          Trusted by engineering teams
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-16 gap-y-5">
          {sources.map(({ name, icon: Icon }) => (
            <span
              key={name}
              className="flex items-center gap-3 text-lg font-extrabold tracking-[-0.04em] text-foreground">
              <Icon className="size-7 text-primary" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
