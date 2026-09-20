"use client";
import { useState } from "react";
import { Globe } from "lucide-react";
import { useStepDraft } from "@/lib/onboarding/use-draft";
import type { PublicDocsDraft } from "@/lib/onboarding/source-model";
import { parsePathList, validatePublicDocsRootUrl } from "@/lib/onboarding/validation";

interface Props {
  onSubmit: (draft: PublicDocsDraft) => void;
  formRef?: React.Ref<HTMLFormElement>;
}

const formLabel = "mb-[9px] mt-[22px] block text-[13px] font-bold text-[#101a43]";
const inputRecipe =
  "w-full border-0 bg-transparent text-[13px] outline-0 placeholder:text-[#8a97b0]";
const boxRecipe =
  "flex flex-col items-stretch gap-2.5 rounded-lg border border-[#cdd8ea] px-[13px] py-[11px] text-[#657494] focus-within:border-brand";

const emptyDraft: PublicDocsDraft = {
  rootUrl: "",
  includePaths: [],
  excludePaths: [],
  crawlInstructions: "",
};

export function PublicDocsSource({ onSubmit, formRef }: Props) {
  const [draft, setDraft] = useStepDraft<PublicDocsDraft>("repository", emptyDraft);
  const [includeText, setIncludeText] = useState(draft.includePaths.join("\n"));
  const [excludeText, setExcludeText] = useState(draft.excludePaths.join("\n"));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validatePublicDocsRootUrl(draft.rootUrl);
    if (err) {
      setError(err);
      return;
    }
    onSubmit({
      ...draft,
      includePaths: parsePathList(includeText),
      excludePaths: parsePathList(excludeText),
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-[560px]">
      <label htmlFor="public-docs-url" className={formLabel}>
        Documentation URL
      </label>
      <div className={boxRecipe}>
        <input
          id="public-docs-url"
          type="text"
          value={draft.rootUrl}
          onChange={(e) => setDraft({ ...draft, rootUrl: e.target.value })}
          placeholder="https://docs.example.com"
          aria-invalid={!!error}
          aria-describedby={error ? "public-docs-url-error" : undefined}
          className={inputRecipe}
        />
      </div>
      {error && (
        <p id="public-docs-url-error" aria-live="polite" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}

      <label htmlFor="include-paths" className={formLabel}>
        Include paths <span className="font-normal text-[#71809b]">(optional, one per line)</span>
      </label>
      <div className={boxRecipe}>
        <textarea
          id="include-paths"
          value={includeText}
          onChange={(e) => setIncludeText(e.target.value)}
          rows={3}
          placeholder={"docs/**\nreference/**"}
          className={inputRecipe}
        />
      </div>

      <label htmlFor="exclude-paths" className={formLabel}>
        Exclude paths <span className="font-normal text-[#71809b]">(optional, one per line)</span>
      </label>
      <div className={boxRecipe}>
        <textarea
          id="exclude-paths"
          value={excludeText}
          onChange={(e) => setExcludeText(e.target.value)}
          rows={3}
          placeholder={"docs/archived/**"}
          className={inputRecipe}
        />
      </div>

      <label htmlFor="crawl-instructions" className={formLabel}>
        Crawl instructions <span className="font-normal text-[#71809b]">(optional)</span>
      </label>
      <div className={boxRecipe}>
        <textarea
          id="crawl-instructions"
          value={draft.crawlInstructions}
          onChange={(e) => setDraft({ ...draft, crawlInstructions: e.target.value })}
          rows={2}
          placeholder="Focus on API reference pages first"
          className={inputRecipe}
        />
      </div>

      <p className="mt-[18px] flex items-center gap-2 text-xs leading-[1.5] text-[#53648e]">
        <Globe size={15} className="text-brand" />
        Draftly crawls public pages only. Private repositories are never sent to Tavily.
      </p>
    </form>
  );
}