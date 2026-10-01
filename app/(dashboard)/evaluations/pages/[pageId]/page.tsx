import { PageQualityDetail } from "@/components/sections/evaluations/page-quality-detail";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ pageId: string }>;
  searchParams: Promise<{ runId?: string }>;
}) {
  const [{ pageId }, query] = await Promise.all([params, searchParams]);
  return <PageQualityDetail pageId={pageId} runId={query.runId} />;
}
