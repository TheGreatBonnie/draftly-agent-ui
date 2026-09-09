import { AlertTriangle, ArrowRight, Code2, HelpCircle, MessagesSquare } from "lucide-react";

const chain = [
  {
    title: "Code changes",
    copy: "PRs, releases, commits",
    icon: Code2,
    tone: "neutral",
  },
  {
    title: "Conversations",
    copy: "Slack, Discord, support chats",
    icon: MessagesSquare,
    tone: "neutral",
  },
  {
    title: "Questions",
    copy: "Customers & devs need answers",
    icon: HelpCircle,
    tone: "neutral",
  },
  {
    title: "Outdated docs",
    copy: "Confusion, churn, wasted time",
    icon: AlertTriangle,
    tone: "danger",
  },
];

export function FeatureSection() {
  return (
    <section id="product" className="section bg-white/84">
      <div className="container-draftly">
        <div className="grid gap-8 border-b border-border pb-9 lg:grid-cols-[320px_1fr] lg:items-center">
          <div>
            <div className="eyebrow text-primary">The problem</div>
            <h2 className="mt-3 max-w-[300px] text-[2rem] font-extrabold leading-[1.06] tracking-[-0.05em]">
              Your product moves fast. Documentation doesn&apos;t.
            </h2>
            <p className="mt-5 max-w-[300px] text-sm font-medium leading-6 text-foreground/75">
              Important changes happen every day in code, conversations, releases,
              and support threads. But documentation falls behind.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
            {chain.map(({ title, copy, icon: Icon, tone }, index) => (
              <div key={title} className="contents">
                <div
                  className={`draftly-card min-h-[142px] rounded-[8px] p-5 ${
                    tone === "danger"
                      ? "border-red-200 bg-red-50/80 shadow-[0_16px_38px_rgba(239,68,68,0.09)]"
                      : ""
                  }`}>
                  <span
                    className={`flex size-9 items-center justify-center rounded-[8px] ${
                      tone === "danger"
                        ? "bg-red-100 text-red-500"
                        : "bg-primary/8 text-primary"
                    }`}>
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-sm font-extrabold">{title}</h3>
                  <p className="mt-3 text-xs font-medium leading-5 text-foreground/75">{copy}</p>
                </div>
                {index < chain.length - 1 && (
                  <ArrowRight className="mx-auto hidden size-4 text-primary md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
