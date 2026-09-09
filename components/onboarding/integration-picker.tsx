"use client";
import {
  Clock3,
  Info,
  LockKeyhole,
  Paperclip,
  ShieldCheck,
  Smile,
  User,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepDraft } from "@/lib/onboarding/use-draft";
import { SlackGlyph, DiscordGlyph } from "@/components/onboarding/design/glyphs";
import { GithubIcon } from "@/components/onboarding/design/glyphs";
import {
  InfoRow,
  cardBase,
  sideBubble,
} from "@/components/onboarding/design/info-row";

interface Props {
  onSubmit: (slack: boolean, discord: boolean) => void;
  loading?: boolean;
}

const metaPill =
  "inline-flex items-center gap-1.5 rounded-md bg-[#f1f4f8] px-[9px] py-1 text-[#465574]";

const ACCESS_ITEMS = [
  { icon: <User size={15} />, label: "Channel messages and threads" },
  { icon: <Paperclip size={15} />, label: "File attachments and links" },
  { icon: <Smile size={15} />, label: "Reactions and emojis" },
  { icon: <UserCheck size={15} />, label: "Mentions and replies" },
  { icon: <Clock3 size={15} />, label: "Event metadata (timestamps, authors)" },
];

export function IntegrationPicker({ onSubmit, loading = false }: Props) {
  const [draft, setDraft] = useStepDraft("integrations", {
    slack: false,
    discord: false,
  });
  const slack = draft.slack;
  const discord = draft.discord;

  const sources = [
    { name: "GitHub", desc: "Repository events, issues, pull requests, and releases.", connected: true },
    { name: "Slack", desc: "Engineering and support conversations, threads, and updates.", connected: slack },
    { name: "Discord", desc: "Developer community discussions and support channels.", connected: discord },
  ] as const;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-[35px] max-[900px]:grid-cols-1">
      <div>
        <div>
          {sources.map(({ name, desc, connected }) => (
            <div
              key={name}
              className="mb-[17px] flex items-center gap-4 rounded-[10px] border border-[#d9e1f0] p-[18px] max-[560px]:flex-wrap max-[560px]:items-start">
              <div
                className={cn(
                  "grid size-10 shrink-0 place-items-center",
                  name === "GitHub" && "text-foreground",
                  name === "Discord" && "text-[#5665ec]",
                )}>
                {name === "GitHub" ? (
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-foreground text-background">
                    <GithubIcon size={24} />
                  </span>
                ) : name === "Slack" ? (
                  <SlackGlyph size={34} />
                ) : (
                  <DiscordGlyph size={36} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <b className="text-base text-[#101a43]">
                  {name}{" "}
                  <small
                    className={cn(
                      "ml-2 rounded-[5px] px-2 py-[5px] text-[11px]",
                      connected
                        ? "bg-[#e8f8ef] text-[#169957]"
                        : "bg-[#eef1f5] text-[#465574]",
                    )}>
                    {connected ? "Connected ✓" : "Not connected"}
                  </small>
                </b>
                <p className="my-[5px] text-xs text-[#53648e]">{desc}</p>
              </div>
              {name !== "GitHub" ? (
                <button
                  onClick={() =>
                    name === "Slack"
                      ? setDraft({ slack: !slack, discord })
                      : setDraft({ slack, discord: !discord })
                  }
                  aria-pressed={connected}
                  className={cn(
                    "flex items-center gap-[11px] whitespace-nowrap rounded-[7px] border bg-white px-[15px] py-[10px] text-[13px] font-semibold max-[560px]:ml-[56px]",
                    connected
                      ? "border-brand bg-brand text-white shadow-[0_4px_9px_#1260ed26]"
                      : "border-[#b9d0fb] text-brand",
                  )}>
                  {connected ? "Connected ✓" : `Connect ${name}`}
                </button>
              ) : (
                <span className={metaPill}>
                  <ShieldCheck size={12} /> Read-only
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Access scope bar */}
        <div className="mt-5 rounded-[10px] border border-[#d9e1f0] px-[17px] py-[15px] text-xs">
          <div className="flex items-center gap-[9px]">
            <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-brand text-white">
              <ShieldCheck size={13} />
            </span>
            <b className="text-[#101a43]">What Draftly can access</b>
            <span className="inline-flex text-[#71809b]">
              <Info size={14} />
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[#243258]">
              Read-only access
            </span>
          </div>
          <div className="mt-3.5 grid grid-cols-5 gap-3.5 border-t border-[#e6ebf3] pt-[15px] max-[900px]:grid-cols-3 max-[560px]:grid-cols-1">
            {ACCESS_ITEMS.map(({ icon, label }) => (
              <div className="flex items-start gap-[9px] text-[#465574]" key={label}>
                <i className="grid size-[30px] shrink-0 place-items-center not-italic rounded-full bg-[#f1f4f8]">
                  {icon}
                </i>
                <small className="text-[11px] leading-normal">{label}</small>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onSubmit(slack, discord)}
          disabled={loading}
          className={cn(
            "mt-6 flex items-center justify-center rounded-[7px] border border-brand bg-brand px-[22px] py-[12px] text-[13px] font-semibold text-white shadow-[0_4px_9px_#1260ed26]",
            loading && "cursor-not-allowed opacity-60",
          )}>
          Continue with these sources
        </button>
      </div>

      {/* Why card */}
      <div className={`${cardBase} px-5 py-[22px] max-[900px]:order-2`}>
        <h3 className="flex items-center gap-[7px] text-sm text-[#7042e9]">
          <Info size={15} /> Why connect sources?
        </h3>
        <p className="-mt-1 mb-1 text-xs leading-[1.55] text-[#53648e]">
          More context helps Draftly detect doc gaps, answer questions, and
          suggest better docs.
        </p>
        <InfoRow
          className="py-[10px]"
          bubbleClassName={sideBubble}
          icon={<LockKeyhole />}
          title="You're in control"
          text="Choose specific channels and repositories."
          tone="purple"
        />
        <div className="rounded-[9px] border border-[#e7dcfb] bg-[#f7f3ff] p-[15px] text-xs leading-[1.5] text-[#263a6f]">
          <LockKeyhole
            size={20}
            className="float-left mr-2.5 box-content size-[18px] rounded-lg bg-[#7042e9] p-1.5 text-white"
          />
          <b className="text-[#3b56d8]">Private by default</b>
          <p className="mt-1.5 text-[11px] text-[#50618a]">
            Integrations are optional. You can add or remove them anytime from
            workspace settings.
          </p>
        </div>
      </div>
    </div>
  );
}
