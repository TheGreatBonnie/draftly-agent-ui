import { EvaluationRunPage } from "@/components/evaluations/evaluation-run-page";

export default async function Page({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  return <EvaluationRunPage runId={runId} />;
}
