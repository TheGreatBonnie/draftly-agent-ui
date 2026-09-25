import { notFound } from "next/navigation";
import { IntegrationDetail } from "@/components/sections/integrations/integration-detail";
import type { IntegrationProvider } from "@/api/integrations";

export default async function Page({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  if (provider !== "github" && provider !== "slack" && provider !== "discord") notFound();
  return <IntegrationDetail provider={provider as IntegrationProvider} />;
}
