import { Github, Hash, MessageSquare } from "lucide-react";
import type { IntegrationProvider } from "@/api/integrations";

export function IntegrationIcon({ provider }: { provider: IntegrationProvider }) {
  const Icon = provider === "github" ? Github : provider === "slack" ? Hash : MessageSquare;
  return <Icon className="h-5 w-5" aria-hidden="true" />;
}
