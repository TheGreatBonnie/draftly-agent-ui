import { WorkflowForm } from "@/components/sections/workflows";

export default async function Page({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const params = await searchParams;
  return <WorkflowForm templateId={params.template} />;
}
