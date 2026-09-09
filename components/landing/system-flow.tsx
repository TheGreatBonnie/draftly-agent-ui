import {
  Check,
  FileText,
  GitPullRequest,
  RadioTower,
  Hash,
  Gamepad2,
} from "lucide-react";

const inputs = [
  {
    name: "GitHub",
    detail: "PR #482 merged",
    copy: "OAuth replaces API keys",
    icon: GitPullRequest,
  },
  {
    name: "Slack",
    detail: "#engineering",
    copy: "OAuth migration is now required",
    icon: Hash,
  },
  {
    name: "Discord",
    detail: "#developers",
    copy: "\"How do I migrate from API keys?\"",
    icon: Gamepad2,
  },
];

const outputs = [
  ["Authentication Guide", "Updated"],
  ["API Reference", "Updated"],
  ["Migration Guide", "New"],
  ["Troubleshooting Guide", "Updated"],
];

const checks = [
  "Change detected",
  "Impact analyzed",
  "Knowledge updated",
  "Docs generated",
  "Evaluated",
  "Human review",
  "Published",
];

function FlowConnectors() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 hidden size-full lg:block"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none">
      <defs>
        <marker
          id="system-flow-arrowhead"
          markerWidth="10"
          markerHeight="14"
          refX="7"
          refY="7"
          orient="auto"
          markerUnits="userSpaceOnUse">
          <path d="m1 1 7 7-7 7" className="flow-arrow-head" />
        </marker>
      </defs>

      <g className="flow-connector">
        <path d="M227 132H250C270 132 270 300 284 300" />
        <path d="M227 300H308" markerEnd="url(#system-flow-arrowhead)" />
        <path d="M227 468H250C270 468 270 300 284 300" />

        <path d="M612 300C644 300 644 120 682 120" markerEnd="url(#system-flow-arrowhead)" />
        <path d="M612 300C644 300 644 240 682 240" markerEnd="url(#system-flow-arrowhead)" />
        <path d="M612 300C644 300 644 360 682 360" markerEnd="url(#system-flow-arrowhead)" />
        <path d="M612 300C644 300 644 480 682 480" markerEnd="url(#system-flow-arrowhead)" />
      </g>
    </svg>
  );
}

export function SystemFlow() {
  return (
    <section id="how-it-works" className="section border-b border-border/80 bg-white/84">
      <div className="container-draftly">
        <div className="soft-panel relative overflow-hidden rounded-[18px] px-7 py-8 md:px-10 md:py-10">
          <div
            aria-hidden="true"
            className="dot-field hero-dot-field-left pointer-events-none absolute inset-y-0 left-0 z-0 w-[30%] opacity-35 [mask-image:linear-gradient(to_right,black,transparent)]"
          />
          <div
            aria-hidden="true"
            className="dot-field hero-dot-field-right pointer-events-none absolute inset-y-0 right-0 z-0 w-[30%] opacity-35 [mask-image:linear-gradient(to_left,black,transparent)]"
          />
          <FlowConnectors />

          <div className="relative z-20 grid items-center gap-5 lg:grid-cols-[minmax(0,212px)_minmax(0,340px)_minmax(0,302px)] lg:justify-between lg:gap-0">
            <div className="space-y-4">
              {inputs.map(({ name, detail, copy, icon: Icon }) => (
                <div key={name} className="draftly-card min-h-[132px] rounded-[8px] p-5">
                  <div className="flex items-start gap-4">
                    <Icon className="mt-1 size-7 text-foreground" />
                    <div>
                      <p className="text-sm font-extrabold">{name}</p>
                      <p className="mt-2 text-xs font-bold text-primary">{detail}</p>
                      <p className="mt-1 max-w-[135px] text-xs font-medium leading-5 text-foreground/75">
                        {copy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mx-auto w-full max-w-[340px]">
              <div className="draftly-card rounded-[8px] px-8 py-7">
                <div className="mb-6 flex items-center gap-2 text-[1.75rem] font-extrabold tracking-[-0.05em]">
                  <span className="flex size-9 items-center justify-center rounded-[7px] bg-primary text-xl font-black text-white">
                    D
                  </span>
                  Draftly
                </div>

                <div className="space-y-3">
                  {checks.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-bold">
                      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="size-3" />
                      </span>
                      <span className="flex-1">{item}</span>
                      {item === "Evaluated" && (
                        <span className="rounded bg-emerald-500 px-2 py-1 text-[0.62rem] font-extrabold text-white">
                          94% PASS
                        </span>
                      )}
                      {item === "Human review" && (
                        <span className="rounded bg-emerald-500 px-2 py-1 text-[0.62rem] font-extrabold text-white">
                          Approved
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="draftly-card mx-auto mt-4 flex max-w-[270px] items-center gap-4 rounded-[8px] px-4 py-3">
                <span className="flex size-10 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
                  <RadioTower className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-extrabold">Documentation is now current</p>
                  <p className="mt-1 text-[0.68rem] font-medium text-muted">2m ago · v18</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {outputs.map(([title, status]) => (
                <div key={title} className="draftly-card min-h-24 rounded-[8px] p-5">
                  <div className="flex items-center gap-4">
                    <span className="flex size-10 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
                      <FileText className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold">{title}</p>
                      <span
                        className={`mt-2 inline-flex rounded px-2 py-1 text-[0.68rem] font-extrabold ${
                          status === "New"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-border" />
      </div>
    </section>
  );
}
