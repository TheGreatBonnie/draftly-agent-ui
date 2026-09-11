import { Bot } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/dashboard/ui";

export default function Page() {
  return <><PageHeader title="Agent templates" subtitle="Agent definitions are currently managed by the Draftly backend catalog." /><EmptyState icon={<Bot className="h-7 w-7" />} title="No templates configured" description="Template-backed agent creation is intentionally not exposed until the backend provides a persistence contract." /></>;
}
