import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";

const proof = [
  "Autonomous",
  "Evaluated",
  "Human-approved",
  "Always up to date",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-8 pt-2">
      <div className="dot-field hero-dot-field-left pointer-events-none absolute inset-y-0 left-0 w-[34%] opacity-60 [mask-image:linear-gradient(to_right,black,transparent)]" />
      <div className="dot-field hero-dot-field-right pointer-events-none absolute inset-y-0 right-0 w-[34%] opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" />
      <div className="container-draftly relative z-10">
        <div className="flex flex-col items-center justify-center pb-7 pt-10 text-center md:pt-16">
          <h1 className="display-heading max-w-[850px]">
            Documentation that <span className="text-[#4338f2]">keeps up</span>{" "}
            with your code.
          </h1>

          <p className="body-large mt-6 max-w-[690px] font-medium text-foreground/85">
            Draftly watches GitHub, Slack, and Discord, understands what
            changes, and turns it into accurate, reviewed, and publishable
            documentation-automatically.
          </p>

          <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row">
            <Link
              href="/sign-up"
              className="flex h-14 items-center gap-3 rounded-[7px] bg-[#4338f2] px-8 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(67,56,242,0.28)] transition hover:opacity-90">
              Start building with Draftly
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="#how-it-works"
              className="flex h-14 items-center gap-3 rounded-[7px] border border-[#4338f2]/25 bg-[#ffffff] px-8 text-sm font-extrabold text-[#091239] shadow-[0_12px_28px_rgba(22,34,78,0.04)] transition hover:bg-[#f7f9ff]">
              See how it works
              <span className="flex size-5 items-center justify-center rounded-full border border-[#4338f2] text-[#4338f2]">
                <Play className="ml-0.5 size-3 fill-current" />
              </span>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-xs font-medium text-foreground/80">
            {proof.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="size-3" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
