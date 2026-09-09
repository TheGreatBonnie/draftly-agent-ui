"use client";
import { useEffect, useMemo, useState } from "react";
import { GitBranch, LockKeyhole, Search } from "lucide-react";
import { listGitHubRepositories } from "@/api/onboarding";
import { cn } from "@/lib/utils";

interface Props {
  onSelect: (fullName: string) => void;
  selected: string | null;
}

const metaPill =
  "inline-flex items-center gap-1.5 rounded-md bg-[#f1f4f8] px-[9px] py-1 text-[#465574]";

export function RepositoryPicker({ onSelect, selected }: Props) {
  const [repos, setRepos] = useState<{ full_name: string; id: number; default_branch?: string; private?: boolean }[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listGitHubRepositories()
      .then(setRepos)
      .catch((e) => setError(e?.message ?? "Failed to load repositories"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      repos.filter((r) =>
        r.full_name.toLowerCase().includes(query.toLowerCase()),
      ),
    [repos, query],
  );

  if (loading)
    return (
      <div className="py-8 text-center text-sm text-[#53648e]">
        Loading repositories...
      </div>
    );
  if (error) return <p className="py-8 text-sm text-red-500">{error}</p>;
  if (repos.length === 0)
    return (
      <p className="py-8 text-sm text-[#53648e]">
        No repositories found. Make sure the GitHub App is installed.
      </p>
    );

  return (
    <div>
      <div className="mb-[18px] mt-[31px] flex gap-3.5 max-[560px]:flex-col">
        <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-[#cdd8ea] px-[13px] py-[11px] text-[#657494] focus-within:border-brand">
          <Search size={17} />
          <input
            placeholder="Search repositories"
            aria-label="Search repositories"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-0 bg-transparent text-[13px] outline-0 placeholder:text-[#8a97b0]"
          />
        </div>
      </div>
      <div>
        {filtered.map((repo) => {
          const [owner, ...rest] = repo.full_name.split("/");
          const name = rest.join("/");
          const chosen = selected === repo.full_name;
          return (
            <button
              key={repo.full_name}
              onClick={() => onSelect(repo.full_name)}
              aria-pressed={chosen}
              className={cn(
                "mb-[9px] flex w-full items-center gap-[15px] rounded-xl border border-[#e0e6f0] bg-white p-[17px] text-left",
                chosen && "border-brand bg-[#f5f8ff] shadow-[0_0_0_1px_#1260ed33]",
              )}>
              <div className="grid size-5 shrink-0 place-items-center rounded-full border border-[#bccae0]">
                {chosen && <span className="size-[9px] rounded-full bg-brand" />}
              </div>
              <div className="min-w-0 flex-1">
                <b className="flex items-center gap-[5px] text-sm text-[#101a43]">
                  {repo.private !== false && <LockKeyhole size={14} />}
                  {owner} / <span className="text-brand">{name}</span>
                </b>
                <small className="mt-[7px] flex items-center gap-2 text-[11px] text-[#50618a]">
                  {repo.default_branch && (
                    <span className={metaPill}>
                      <GitBranch size={12} /> {repo.default_branch}
                    </span>
                  )}
                </small>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-sm text-[#53648e]">
            No repositories match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}
