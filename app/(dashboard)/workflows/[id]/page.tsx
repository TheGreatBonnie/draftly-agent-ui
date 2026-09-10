import { WorkflowDetailPage } from "@/components/sections/workflows";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WorkflowDetailPage id={decodeURIComponent(id)} />;
}
