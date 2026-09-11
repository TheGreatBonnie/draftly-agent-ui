"use client";

import { useMemo, useState } from "react";
import { Code2, Eye, GitCompareArrows } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReviewFileViewModel } from "@/lib/reviews";

type ViewMode = "rendered" | "diff" | "source";
type DiffLine = {
  content: string;
  newLine?: number;
  oldLine?: number;
  type: "added" | "removed" | "unchanged";
};

const views = [
  { id: "rendered", label: "Rendered", icon: Eye },
  { id: "diff", label: "Diff", icon: GitCompareArrows },
  { id: "source", label: "Source", icon: Code2 },
] as const;

function createLineDiff(original: string, proposed: string): DiffLine[] {
  const before = original ? original.split("\n") : [];
  const after = proposed ? proposed.split("\n") : [];
  const lengths = Array.from({ length: before.length + 1 }, () =>
    Array<number>(after.length + 1).fill(0),
  );

  for (let i = before.length - 1; i >= 0; i -= 1) {
    for (let j = after.length - 1; j >= 0; j -= 1) {
      lengths[i][j] =
        before[i] === after[j]
          ? lengths[i + 1][j + 1] + 1
          : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let oldLine = 1;
  let newLine = 1;

  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) {
      lines.push({ content: before[i], oldLine, newLine, type: "unchanged" });
      i += 1;
      j += 1;
      oldLine += 1;
      newLine += 1;
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      lines.push({ content: before[i], oldLine, type: "removed" });
      i += 1;
      oldLine += 1;
    } else {
      lines.push({ content: after[j], newLine, type: "added" });
      j += 1;
      newLine += 1;
    }
  }

  while (i < before.length) {
    lines.push({ content: before[i], oldLine, type: "removed" });
    i += 1;
    oldLine += 1;
  }
  while (j < after.length) {
    lines.push({ content: after[j], newLine, type: "added" });
    j += 1;
    newLine += 1;
  }

  return lines;
}

export default function ReviewDocument({
  files,
  originalContent,
  path,
  proposedContent,
}: {
  files?: ReviewFileViewModel[];
  originalContent?: string | null;
  path?: string | null;
  proposedContent?: string | null;
}) {
  const [view, setView] = useState<ViewMode>("rendered");
  const normalizedFiles = files?.length
    ? files
    : [{
        path: path ?? "Generated document",
        action: "update",
        originalContent: originalContent ?? null,
        proposedContent: proposedContent ?? "",
        originalContentAvailable: originalContent !== null && originalContent !== undefined,
      } satisfies ReviewFileViewModel];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedFile = normalizedFiles[selectedIndex] ?? normalizedFiles[0];
  const currentOriginal = selectedFile.originalContentAvailable
    ? selectedFile.originalContent ?? ""
    : "";
  const currentProposed = selectedFile.proposedContent ?? "";
  const diff = useMemo(
    () => createLineDiff(currentOriginal, currentProposed),
    [currentOriginal, currentProposed],
  );
  const additions = diff.filter((line) => line.type === "added").length;
  const deletions = diff.filter((line) => line.type === "removed").length;

  return (
    <div className="mx-4 mb-4 mt-4 min-w-0 max-w-full overflow-hidden rounded-xl border border-border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-muted px-4 py-3">
        <div className="min-w-0">
          {normalizedFiles.length > 1 ? (
            <label className="flex items-center gap-2 text-[11px] text-foreground-muted">
              File
              <select
                aria-label="Review file"
                className="max-w-[260px] rounded border border-border bg-surface px-2 py-1 font-mono text-xs text-foreground"
                value={selectedIndex}
                onChange={(event) => setSelectedIndex(Number(event.target.value))}
              >
                {normalizedFiles.map((file, index) => <option key={`${file.path}-${index}`} value={index}>{file.path}</option>)}
              </select>
            </label>
          ) : <div className="truncate font-mono text-xs font-medium text-foreground">{selectedFile.path}</div>}
          <div className="mt-1 text-[11px] text-foreground-muted">
            <span className="font-semibold text-success">+{additions}</span>
            <span className="ml-2 font-semibold text-danger">-{deletions}</span>
          </div>
        </div>
        <div
          aria-label="Document view"
          className="flex rounded-lg border border-border bg-surface p-1"
          role="tablist"
        >
          {views.map(({ id, icon: Icon, label }) => (
            <button
              aria-controls={`review-document-${id}`}
              aria-selected={view === id}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition ${
                view === id
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "text-foreground-muted hover:bg-surface-subtle hover:text-foreground"
              }`}
              id={`review-document-tab-${id}`}
              key={id}
              onClick={() => setView(id)}
              role="tab"
              type="button"
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        aria-labelledby={`review-document-tab-${view}`}
        className="min-w-0 max-w-full"
        id={`review-document-${view}`}
        role="tabpanel"
      >
        {view === "rendered" && (
            <article className="prose prose-slate max-w-none bg-surface px-5 py-6 prose-headings:scroll-mt-24 prose-headings:text-foreground prose-p:text-foreground-secondary prose-a:text-brand prose-blockquote:border-brand prose-blockquote:text-foreground-secondary prose-code:text-foreground prose-pre:bg-code prose-pre:text-code-foreground dark:prose-invert md:px-7">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentProposed}</ReactMarkdown>
          </article>
        )}

        {view === "diff" && (
          selectedFile.originalContentAvailable ? <div className="max-h-[640px] min-w-0 max-w-full overflow-auto bg-surface font-mono text-xs leading-6">
            {diff.map((line, index) => {
              const tone = line.type === "added" ? "bg-success-soft text-foreground" : line.type === "removed" ? "bg-danger-soft text-foreground" : "text-foreground-secondary";
              const marker = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
              return <div className={`grid min-w-max grid-cols-[42px_42px_24px_minmax(0,1fr)] ${tone}`} key={`${index}-${line.type}`}><span className="select-none border-r border-border px-2 text-right text-foreground-muted">{line.oldLine ?? ""}</span><span className="select-none border-r border-border px-2 text-right text-foreground-muted">{line.newLine ?? ""}</span><span className="select-none text-center text-foreground-muted">{marker}</span><span className="whitespace-pre pr-4">{line.content || " "}</span></div>;
            })}
          </div> : <div className="space-y-3 bg-surface p-5 text-sm text-foreground-secondary"><p className="font-medium text-foreground">Original content unavailable</p><p>The proposed document is shown below; a line-by-line diff is not available for this file.</p><pre className="max-h-[560px] overflow-auto rounded-lg bg-code p-4 text-xs leading-6 text-code-foreground">{currentProposed}</pre></div>
        )}

        {view === "source" && (
          <pre aria-label="Raw Markdown source" className="max-h-[640px] min-w-0 max-w-full overflow-auto bg-code p-5 text-xs leading-6 text-code-foreground" tabIndex={0}>
            <code>{currentProposed}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
