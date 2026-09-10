import { AgentDetailPage } from "@/components/sections/agents";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AgentDetailPage id={id} />;
}
