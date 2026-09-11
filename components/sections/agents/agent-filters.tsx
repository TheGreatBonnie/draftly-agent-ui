"use client";

import { SearchBox } from "@/components/dashboard/ui";

export function AgentFilters({
  query,
  surface,
  status,
  surfaces,
  onQueryChange,
  onSurfaceChange,
  onStatusChange,
}: {
  query: string;
  surface: string;
  status: string;
  surfaces: string[];
  onQueryChange: (value: string) => void;
  onSurfaceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}) {
  return <div className="mt-4 flex min-w-0 flex-wrap gap-2">
    <SearchBox className="min-w-[220px] flex-1" placeholder="Search agents, tools, or roles..." value={query} onChange={onQueryChange} />
    <label className="sr-only" htmlFor="agent-surface">Filter by surface</label>
    <select id="agent-surface" value={surface} onChange={(event) => onSurfaceChange(event.target.value)} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground-secondary">
      <option value="all">All surfaces</option>
      {surfaces.map((value) => <option key={value} value={value}>{value}</option>)}
    </select>
    <label className="sr-only" htmlFor="agent-status">Filter by status</label>
    <select id="agent-status" value={status} onChange={(event) => onStatusChange(event.target.value)} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground-secondary">
      <option value="all">All statuses</option>
      <option value="running">Running</option>
      <option value="completed">Completed</option>
      <option value="failed">Failed</option>
      <option value="idle">Idle</option>
    </select>
  </div>;
}
