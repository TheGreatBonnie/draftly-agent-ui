"use client";
import { useState } from "react";
import { validateWorkspaceName } from "@/lib/onboarding/validation";
import { useStepDraft } from "@/lib/onboarding/use-draft";

interface Props {
  onSubmit: (name: string, description: string) => void;
  formRef?: React.Ref<HTMLFormElement>;
  initialName?: string;
  initialDescription?: string;
}

const formLabel = "mb-[9px] mt-[22px] block text-[13px] font-bold text-[#101a43]";
const inputRecipe =
  "w-full border-0 bg-transparent text-[13px] outline-0 placeholder:text-[#8a97b0]";

export function WorkspaceForm({
  onSubmit,
  formRef,
  initialName = "",
  initialDescription = "",
}: Props) {
  const [draft, setDraft] = useStepDraft("workspace", {
    name: initialName,
    description: initialDescription,
  });
  const name = draft.name;
  const description = draft.description;
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateWorkspaceName(name);
    if (err) {
      setError(err);
      return;
    }
    onSubmit(name, description);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-[560px]">
      <div>
        <label htmlFor="workspace-name" className={formLabel}>Workspace name</label>
        <div className="flex flex-col items-stretch gap-2.5 rounded-lg border border-[#cdd8ea] px-[13px] py-[11px] text-[#657494] focus-within:border-brand">
          <input
            id="workspace-name"
            type="text"
            value={name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="e.g. my-project"
            aria-invalid={!!error}
            aria-describedby={error ? "workspace-name-error" : undefined}
            className={inputRecipe}
          />
        </div>
        {error && (
          <p
            id="workspace-name-error"
            aria-live="polite"
            className="mt-2 text-[11px] text-red-500"
          >
            {error}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="workspace-description" className={formLabel}>
          Description{" "}
          <small className="font-normal text-[#53648e]">(optional)</small>
        </label>
        <textarea
          id="workspace-description"
          value={description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          rows={3}
          placeholder="A short description of what your workspace is for"
          className="min-h-[80px] w-full resize-y rounded-lg border border-[#cdd8ea] px-[13px] py-[11px] text-[13px] text-[#101a43] outline-none placeholder:text-[#8a97b0] focus:border-brand"
        />
      </div>
    </form>
  );
}
