import {
  Bot,
  Check,
  Circle,
  FileText,
  GitPullRequest,
  Lock,
  MessageSquare,
  RadioTower,
  Search,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

const bullets: { title: string; copy: string; icon: LucideIcon }[] = [
  { title: "Agentic workflows", copy: "Research, plan, write, and refine-autonomously.", icon: Bot },
  { title: "Knowledge layer", copy: "Structured understanding of your product and docs.", icon: MessageSquare },
  { title: "Evaluation engine", copy: "Quality, grounding, completeness, consistency, freshness.", icon: ShieldCheck },
  { title: "Human in the loop", copy: "Automation where possible. Judgment where it matters.", icon: UserRound },
];

const rows: {
  task: string;
  target: string;
  status: string;
  state: "done" | "active" | "pending";
  icon: LucideIcon;
}[] = [
  { task: "Detect change", target: "GitHub PR #482", status: "Completed", state: "done", icon: GitPullRequest },
  { task: "Impact analysis", target: "3 docs affected", status: "Completed", state: "done", icon: Search },
  { task: "Research", target: "Collecting context", status: "Completed", state: "done", icon: FileText },
  { task: "Knowledge update", target: "OAuth migration", status: "Completed", state: "done", icon: Bot },
  { task: "Generate docs", target: "Authentication Guide", status: "In progress", state: "active", icon: FileText },
  { task: "Evaluate", target: "Quality check", status: "Pending", state: "pending", icon: ShieldCheck },
  { task: "Human review", target: "API Maintainers", status: "Pending", state: "pending", icon: Lock },
  { task: "Publish", target: "docs.relayops.dev", status: "Pending", state: "pending", icon: RadioTower },
];

const scores = [
  ["Faithfulness", "0.96"],
  ["Completeness", "0.91"],
  ["Consistency", "0.94"],
  ["Grounding", "0.98"],
  ["Freshness", "0.97"],
];

export function KnowledgeSection() {
  return (
    <section className="section relative overflow-hidden bg-white/84">
      <div
        aria-hidden="true"
        className="dot-field hero-dot-field-left pointer-events-none absolute inset-y-0 left-0 w-[30%] opacity-35 [mask-image:linear-gradient(to_right,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="dot-field hero-dot-field-right pointer-events-none absolute inset-y-0 right-0 w-[30%] opacity-35 [mask-image:linear-gradient(to_left,black,transparent)]"
      />
      <div className="container-draftly relative z-10">
        <div className="grid gap-8 border-b border-border pb-9 lg:grid-cols-[300px_1fr_290px]">
          <div>
            <div className="eyebrow text-primary">
              Not an AI writer. A documentation engineering system.
            </div>
            <h2 className="mt-3 text-[2.05rem] font-extrabold leading-[1.05] tracking-[-0.05em]">
              Built for quality, context, and continuous updates.
            </h2>

            <div className="mt-7 space-y-5">
              {bullets.map(({ title, copy, icon: Icon }) => (
                <div key={title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold">{title}</h3>
                    <p className="mt-1 text-xs font-medium leading-5 text-foreground/70">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="draftly-card rounded-[8px] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-base font-extrabold">OAuth Migration Documentation</h3>
              <span className="rounded bg-primary/10 px-2.5 py-1 text-[0.68rem] font-extrabold text-primary">
                Running
              </span>
            </div>

            <div className="space-y-3">
              {rows.map(({ task, target, status, state, icon: Icon }) => (
                <div key={task} className="grid grid-cols-[22px_1fr_1fr_auto] items-center gap-3 text-xs">
                  <Icon className={`size-4 ${state === "active" ? "text-primary" : "text-emerald-500"}`} />
                  <span className="font-extrabold">{task}</span>
                  <span className="font-medium text-foreground/75">{target}</span>
                  <span
                    className={`flex min-w-[78px] items-center justify-end gap-2 font-bold ${
                      state === "pending" ? "text-muted" : state === "active" ? "text-primary" : "text-emerald-600"
                    }`}>
                    {status}
                    {state === "done" ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Circle className="size-3 fill-current opacity-25" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="draftly-card rounded-[8px] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-base font-extrabold">Authentication Guide</h3>
              <span className="rounded bg-slate-100 px-2.5 py-1 text-[0.68rem] font-extrabold text-slate-600">
                v18 (Draft)
              </span>
            </div>

            <h4 className="text-sm font-extrabold">Summary</h4>
            <p className="mt-3 text-xs font-medium leading-5 text-foreground/70">
              Updated OAuth migration instructions and examples.
            </p>

            <h4 className="mt-7 text-sm font-extrabold">Evaluation results</h4>
            <div className="mt-3 space-y-2">
              {scores.map(([label, score]) => (
                <div key={label} className="flex justify-between text-xs font-medium">
                  <span className="text-foreground/75">{label}</span>
                  <span className="font-extrabold">{score}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between text-sm font-extrabold">
              <span>Overall</span>
              <span className="rounded-full bg-emerald-200 px-4 py-1 text-[0.7rem] text-emerald-800">
                90%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
