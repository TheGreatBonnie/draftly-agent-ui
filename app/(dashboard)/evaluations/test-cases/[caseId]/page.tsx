import { EvaluationCasePage } from "@/components/evaluations/evaluation-case-page";

export default async function Page({ params, searchParams }: { params: Promise<{ caseId: string }>; searchParams: Promise<{ runId?: string }> }) {
  const [{ caseId }, query] = await Promise.all([params, searchParams]);
  return <EvaluationCasePage caseId={caseId} runId={query.runId} />;
}
