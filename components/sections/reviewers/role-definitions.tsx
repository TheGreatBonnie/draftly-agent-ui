import { Shield } from "lucide-react";
import { Badge, Card } from "@/components/dashboard/ui";

const roles = [
  { name: "Admin", tone: "blue" as const, description: "Manages reviewer records and organization access." },
  { name: "Member", tone: "slate" as const, description: "Can view reviewer information, but cannot manage reviewer records." },
  { name: "Reviewer", tone: "violet" as const, description: "Can register as a reviewer and edit their own notification preferences." },
];

export function RoleDefinitions() {
  return <Card className="h-fit p-4">
    <div className="flex items-center gap-2 border-b border-border pb-3">
      <Shield aria-hidden="true" className="h-4 w-4 text-foreground-muted" />
      <h2 className="font-semibold">Role definitions</h2>
    </div>
    <ul className="mt-4 space-y-5">
      {roles.map((role) => <li key={role.name}>
        <Badge tone={role.tone}>{role.name}</Badge>
        <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{role.description}</p>
      </li>)}
    </ul>
  </Card>;
}
