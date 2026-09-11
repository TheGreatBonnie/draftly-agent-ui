import { PageHeader } from "@/components/dashboard/ui";
import { KnowledgeDetailView } from "@/components/sections/knowledge/knowledge-components";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <PageHeader
        title="Knowledge item"
        subtitle="Inspect the persisted fact, provenance evidence, relationships, and feedback."
      />
      <KnowledgeDetailView id={id} />
    </>
  );
}
