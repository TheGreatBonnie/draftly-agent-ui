export function validateWorkspaceName(name: string): string | null {
  if (!name || name.trim().length === 0) return "Workspace name is required";
  if (name.trim().length < 2) return "Workspace name must be at least 2 characters";
  if (name.trim().length > 50) return "Workspace name must be under 50 characters";
  return null;
}

export function validateRepositoryName(name: string): string | null {
  if (!name || name.trim().length === 0) return "Repository name is required";
  if (!/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(name)) return "Repository must be in owner/repo format";
  return null;
}

export function validateIncludePaths(paths: string[]): string | null {
  if (paths.length === 0) return "At least one include path is required";
  return null;
}

export function validateReviewPolicy(policy: string): string | null {
  const valid = ["always", "medium-high", "auto-low"];
  if (!valid.includes(policy)) return `Review policy must be one of: ${valid.join(", ")}`;
  return null;
}

export function validateDocStyle(style: string): string | null {
  const valid = ["technical", "developer-focused", "conversational"];
  if (!valid.includes(style)) return `Documentation style must be one of: ${valid.join(", ")}`;
  return null;
}

export function validatePublicDocsRootUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Documentation URL is required";
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "https:") return "Documentation URL must start with https://";
    if (u.username || u.password) return "Documentation URL must not contain credentials";
    if (!u.hostname) return "Enter a valid URL (e.g. https://docs.example.com)";
    return null;
  } catch {
    return "Enter a valid URL (e.g. https://docs.example.com)";
  }
}

export function parsePathList(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
