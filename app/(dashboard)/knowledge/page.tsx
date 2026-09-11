"use client";

import { PageHeader, Tabs } from "@/components/dashboard/ui";
import Link from "next/link";
import { KnowledgeOverview, knowledgeTabs } from "@/components/sections/knowledge/knowledge-components";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Knowledge"
        subtitle="Your organization’s persisted product knowledge, organized and connected."
        actions={<Link href="/integrations" className="inline-flex h-10 items-center justify-center rounded-lg border border-transparent bg-brand px-4 text-sm font-medium text-brand-foreground hover:brightness-110">Manage integrations</Link>}
      />
      <Tabs active="Overview" items={knowledgeTabs} />
      <div className="mt-4"><KnowledgeOverview /></div>
    </>
  );
}
