import {
  GitPullRequest,
  Hash,
  MessagesSquare,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

const integrations: { name: string; description: string; icon: LucideIcon }[] = [
  { name: "GitHub", description: "Code, PRs, issues, releases", icon: GitPullRequest },
  { name: "Slack", description: "Channels, threads, conversations", icon: Hash },
  { name: "Discord", description: "Servers, channels, discussions", icon: MessagesSquare },
  { name: "More", description: "Coming soon", icon: MoreHorizontal },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="section-small bg-white/84">
      <div className="container-draftly">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-end">
          <div>
            <div className="eyebrow text-primary">Built around the tools you already use</div>
            <h2 className="mt-4 text-xl font-extrabold tracking-[-0.04em]">
              Connect your sources. Let Draftly handle the rest.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {integrations.map(({ name, description, icon: Icon }) => (
              <div key={name} className="draftly-card rounded-[8px] p-5">
                <div className="flex items-center gap-4">
                  <Icon className="size-8 text-primary" />
                  <div>
                    <h3 className="text-sm font-extrabold">{name}</h3>
                    <p className="mt-1 text-[0.68rem] font-medium leading-4 text-foreground/65">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
