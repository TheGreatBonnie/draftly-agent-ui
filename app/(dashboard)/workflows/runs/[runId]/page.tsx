import { WorkflowRunDetailPage } from "@/components/sections/workflows";

export default async function Page({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  return <WorkflowRunDetailPage workflowId={null} runId={decodeURIComponent(runId)} />;
}
