import { WorkflowRunDetailPage } from "@/components/sections/workflows";

export default async function Page({ params }: { params: Promise<{ id: string; runId: string }> }) {
  const { id, runId } = await params;
  return <WorkflowRunDetailPage workflowId={decodeURIComponent(id)} runId={decodeURIComponent(runId)} />;
}
