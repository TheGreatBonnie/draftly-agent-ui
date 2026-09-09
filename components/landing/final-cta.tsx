import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="section-small bg-white/84">
      <div className="container-draftly">
        <div className="relative overflow-hidden rounded-[12px] bg-[linear-gradient(135deg,#141267,#2e20d8)] px-7 py-10 text-white shadow-[0_24px_70px_rgba(30,24,134,0.25)] md:px-20">
          <div className="dot-field pointer-events-none absolute bottom-0 right-0 h-full w-[38%] opacity-35 [mask-image:linear-gradient(to_left,black,transparent)]" />

          <div className="grid items-center gap-8 md:grid-cols-[300px_1fr]">
            <div className="relative hidden h-[185px] md:block">
              <div className="absolute left-10 top-2 h-24 w-32 rotate-[-4deg] rounded-[8px] bg-[#ffffff]/78 p-4 shadow-2xl">
                <div className="h-3 w-16 rounded bg-[#4338f2]/30" />
                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded bg-[#4338f2]/20" />
                  <div className="h-2 w-4/5 rounded bg-[#4338f2]/20" />
                </div>
              </div>
              <div className="absolute left-28 top-10 h-28 w-36 rotate-[7deg] rounded-[8px] bg-[#ffffff] p-4 shadow-2xl">
                <div className="h-3 w-20 rounded bg-[#4338f2]/25" />
                <div className="mt-5 space-y-2">
                  <div className="h-2 rounded bg-[#4338f2]/20" />
                  <div className="h-2 w-3/4 rounded bg-[#4338f2]/20" />
                  <div className="h-2 w-5/6 rounded bg-[#4338f2]/20" />
                </div>
              </div>
              <div className="absolute bottom-0 left-20 h-32 w-32 rounded-[8px] bg-[#ffffff] p-4 shadow-2xl">
                <div className="space-y-3">
                  <div className="h-2 w-16 rounded bg-[#4338f2]/25" />
                  <div className="h-2 rounded bg-[#4338f2]/15" />
                  <div className="h-2 rounded bg-[#4338f2]/15" />
                  <div className="h-2 w-4/5 rounded bg-[#4338f2]/15" />
                </div>
              </div>
              <span className="absolute left-[172px] top-[86px] flex size-11 items-center justify-center rounded-full bg-[#4338f2] text-white shadow-lg">
                <Check className="size-6" />
              </span>
            </div>

            <div className="relative z-10">
              <h2 className="max-w-[640px] text-[2rem] font-extrabold leading-tight tracking-[-0.045em]">
                Build documentation that evolves with your product.
              </h2>
              <p className="mt-5 max-w-[560px] text-sm font-medium leading-7 text-white/78">
                Start in minutes. Connect your sources, define your workflows,
                and let Draftly keep your docs current.
              </p>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="flex h-12 items-center justify-center gap-3 rounded-[7px] bg-[#ffffff] px-7 text-sm font-extrabold text-[#4338f2] transition hover:bg-[#ffffff]/90">
                  Start building with Draftly
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#product"
                  className="flex h-12 items-center justify-center gap-3 rounded-[7px] border border-white/55 px-7 text-sm font-extrabold text-white transition hover:bg-white/10">
                  Explore the product
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
