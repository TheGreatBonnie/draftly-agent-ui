import { Pencil, Trash2 } from "lucide-react";
import { Badge, Card, Skeleton } from "@/components/dashboard/ui";
import type { Reviewer } from "@/api/types";
import { reviewerPermissions, type ReviewerRow } from "@/lib/reviewers";

export function ReviewersTable({
  rows, reviewers, role, currentUserId, loading, search, onEdit, onDelete,
}: {
  rows: ReviewerRow[];
  reviewers: Reviewer[];
  role: string | undefined;
  currentUserId: string | null;
  loading: boolean;
  search: string;
  onEdit: (reviewer: Reviewer) => void;
  onDelete: (reviewer: Reviewer) => void;
}) {
  return <Card className="min-w-0 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] whitespace-nowrap text-left text-sm">
        <thead className="border-b border-border bg-surface-subtle text-xs font-medium uppercase tracking-wider text-foreground-muted">
          <tr>
            <th scope="col" className="px-4 py-3">Name</th>
            <th scope="col" className="px-4 py-3">Channels</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? Array.from({ length: 3 }, (_, index) => <tr key={index}><td colSpan={4} className="px-4 py-3"><Skeleton className="h-8 w-full" /></td></tr>)
            : rows.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-foreground-muted">{search ? "No reviewers match your search." : "No reviewers found."}</td></tr>
            : rows.map((row) => {
              const reviewer = reviewers.find((item) => item.id === row.id);
              const permissions = reviewer ? reviewerPermissions(role, currentUserId, reviewer) : null;
              return <tr key={row.id} className="transition-colors hover:bg-surface-subtle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-subtle text-xs font-semibold text-foreground-secondary">{row.initials}</span>
                    <span className="min-w-0"><span className="block font-medium text-foreground">{row.name}</span>{row.email && <span className="block text-xs text-foreground-muted">{row.email}</span>}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><div className="flex gap-1.5">{row.channels.length ? row.channels.map((channel) => <Badge key={channel} tone={channel === "Email" ? "green" : channel === "Discord" ? "violet" : "blue"}>{channel}</Badge>) : <span className="text-xs text-foreground-muted">None</span>}</div></td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className={`h-2 w-2 rounded-full ${row.isActive ? "bg-success" : "bg-foreground-muted"}`} />{row.isActive ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-3 text-right">
                  {reviewer && <div className="flex justify-end gap-1">
                    {permissions?.edit && <button type="button" onClick={() => onEdit(reviewer)} aria-label={`Edit ${row.name}`} title={permissions.create ? "Edit reviewer" : "Edit profile"} className="rounded-lg p-2 text-foreground-muted hover:bg-brand-soft hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"><Pencil aria-hidden="true" className="h-4 w-4" /></button>}
                    {permissions?.delete && <button type="button" onClick={() => onDelete(reviewer)} aria-label={`Delete ${row.name}`} title="Delete reviewer" className="rounded-lg p-2 text-foreground-muted hover:bg-danger-soft hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-danger"><Trash2 aria-hidden="true" className="h-4 w-4" /></button>}
                  </div>}
                </td>
              </tr>;
            })}
        </tbody>
      </table>
    </div>
    <div className="border-t border-border bg-surface-subtle px-4 py-3 text-xs text-foreground-muted" role="status">Showing {loading ? "—" : rows.length} of {reviewers.length} reviewers</div>
  </Card>;
}
