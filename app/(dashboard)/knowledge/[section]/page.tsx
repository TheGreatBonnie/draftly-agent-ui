import { PageHeader, Tabs } from "@/components/dashboard/ui";
import Link from "next/link";
import { KnowledgeSurface, knowledgeTabs } from "@/components/sections/knowledge/knowledge-components";

const labels: Record<string, string> = {
  documents: "Documents",
  sources: "Sources",
  graph: "Knowledge Graph",
  topics: "Topics",
  embeddings: "Embeddings",
};

export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const active = labels[section] || "Documents";
  return (
    <>
      <PageHeader
        title="Knowledge"
        subtitle="Browse organization-scoped knowledge and its persisted provenance."
        actions={<Link href="/integrations" className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground-secondary hover:bg-surface-subtle">Manage integrations</Link>}
      />
      <Tabs active={active} items={knowledgeTabs} />
      <div className="mt-4"><KnowledgeSurface section={section} /></div>
    </>
  );
}
