import { Bot } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/dashboard/ui";

export default function Page() {
  return <><PageHeader title="New agent" subtitle="Agent definitions are currently managed by the Draftly backend catalog." /><EmptyState icon={<Bot className="h-7 w-7" />} title="Configurable agents are not available" description="This deployment exposes immutable, production-managed agent definitions. No create action is persisted from this page." /></>;
}
