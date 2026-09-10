"use client";

import { Bot } from "lucide-react";
import { Button, EmptyState, Skeleton } from "@/components/dashboard/ui";
import { useAgentDetail } from "@/hooks/use-agent-detail";
import { useAgentRuns } from "@/hooks/use-agent-runs";
import { AgentDetail } from "./agent-detail";

export function AgentDetailPage({ id }: { id: string }) {
  const detail = useAgentDetail(id);
  const runs = useAgentRuns(id);
  if (detail.loading) return <div className="space-y-3"><Skeleton className="h-12 w-2/3" /><Skeleton className="h-64 w-full" /></div>;
  if (detail.error || !detail.data) return <EmptyState icon={<Bot className="h-7 w-7" />} title="Agent unavailable" description={detail.error ?? "This agent does not exist in the backend catalog."} action={<Button onClick={detail.retry}>Retry</Button>} />;
  return <AgentDetail data={detail.data} steps={runs.steps} streamStatus={runs.streamStatus} selectedRunId={runs.selectedId} onSelectRun={runs.selectRun} />;
}
