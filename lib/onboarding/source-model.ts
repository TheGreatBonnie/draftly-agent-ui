import type {
  PublicDocumentationConfig,
  RepositoryPayload,
} from "./types";

export interface PublicDocsDraft {
  rootUrl: string;
  includePaths: string[];
  excludePaths: string[];
  crawlInstructions: string;
}

export function isPublicDocumentation(sourceType?: string): boolean {
  return sourceType === "public_documentation";
}

export function hostnameForUrl(value: string): string {
  try {
    return new URL(value.trim()).hostname || "public-docs";
  } catch {
    return "public-docs";
  }
}

export function buildRepositoryPayload(draft: PublicDocsDraft): RepositoryPayload {
  const config: PublicDocumentationConfig = {
    root_url: draft.rootUrl.trim(),
    include_paths: draft.includePaths,
    exclude_paths: draft.excludePaths,
  };
  if (draft.crawlInstructions.trim()) {
    config.crawl_instructions = draft.crawlInstructions.trim();
  }
  return {
    full_name: hostnameForUrl(draft.rootUrl),
    source_type: "public_documentation",
    documentation_config: config,
  };
}

export function candidateLabel(candidate: string): string {
  if (/^https?:\/\//.test(candidate)) {
    try {
      const u = new URL(candidate);
      const last = u.pathname.split("/").filter(Boolean).pop();
      return last || u.hostname;
    } catch {
      return candidate;
    }
  }
  return candidate.split("/").filter(Boolean).pop() ?? candidate;
}