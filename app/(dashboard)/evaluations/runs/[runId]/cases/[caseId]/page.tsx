import { EvaluationCasePage } from "@/components/evaluations/evaluation-case-page";

export default async function Page({ params }: { params: Promise<{ runId: string; caseId: string }> }) {
  const { runId, caseId } = await params;
  return <EvaluationCasePage caseId={caseId} runId={runId} />;
}
