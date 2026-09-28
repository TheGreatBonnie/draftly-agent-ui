import { notFound } from "next/navigation";
import type { IntegrationProvider } from "@/api/integrations.ts";
import { IntegrationDetail } from "@/components/sections/integrations/integration-detail";

const PROVIDER_IDS = new Set(["github", "slack", "discord"]);

export function generateStaticParams() {
  return [{ provider: "github" }, { provider: "slack" }, { provider: "discord" }];
}

export default async function Page({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  if (!PROVIDER_IDS.has(provider)) notFound();
  return <IntegrationDetail provider={provider as IntegrationProvider} />;
}
