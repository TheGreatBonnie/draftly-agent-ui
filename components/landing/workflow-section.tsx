import {
  ArrowRight,
  BrainCircuit,
  FileText,
  RadioTower,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const steps = [
  {
    title: "1. Capture",
    copy: "Draftly listens to GitHub, Slack, and Discord.",
    icon: RadioTower,
    color: "bg-violet-100 text-primary",
  },
  {
    title: "2. Understand",
    copy: "We identify what changed and why it matters.",
    icon: BrainCircuit,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "3. Build",
    copy: "Specialized agents create or update the right docs.",
    icon: FileText,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "4. Evaluate",
    copy: "Every change is evaluated for quality and accuracy.",
    icon: ShieldCheck,
    color: "bg-orange-100 text-orange-500",
  },
  {
    title: "5. Review & Publish",
    copy: "Humans approve high-impact changes before publishing.",
    icon: UsersRound,
    color: "bg-emerald-100 text-emerald-600",
  },
];

export function WorkflowSection() {
  return (
    <section className="section bg-white/84">
      <div className="container-draftly">
        <div className="border-b border-border pb-9 text-center">
          <div className="eyebrow text-primary">How Draftly works</div>

          <div className="mt-7 grid gap-7 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] md:items-start">
            {steps.map(({ title, copy, icon: Icon, color }, index) => (
              <div key={title} className="contents">
                <div className="flex flex-col items-center">
                  <div className={`flex size-20 items-center justify-center rounded-full ${color}`}>
                    <Icon className="size-9 stroke-[2.4]" />
                  </div>
                  <h3 className="mt-5 text-base font-extrabold">{title}</h3>
                  <p className="mt-2 max-w-[160px] text-xs font-medium leading-5 text-foreground/70">
                    {copy}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="mt-10 hidden items-center md:flex">
                    <span className="h-px w-12 border-t border-dotted border-primary/70" />
                    <ArrowRight className="size-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
