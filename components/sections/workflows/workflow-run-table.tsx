import Link from "next/link";
import { CheckCircle2, Circle, CircleX, GitBranch } from "lucide-react";
import { Badge, Card } from "@/components/dashboard/ui";
import { formatRelativeTime, statusTone, type WorkflowRunRow } from "@/lib/workflow-view-model";

function StagePipeline({ stages }: { stages: WorkflowRunRow["stages"] }) {
  if (stages.length === 0) return <span className="text-xs text-foreground-muted">No stages yet</span>;

  return <ol className="flex w-max items-center gap-1.5" aria-label="Executed stages">
    {stages.map((stage, index) => (
      <li key={stage.key} className="flex items-center gap-1.5" title={`${stage.label}: ${stage.status.replaceAll("_", " ")}`}>
        {stage.status === "completed" ? <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-success" />
          : stage.status === "failed" ? <CircleX aria-hidden="true" className="h-3.5 w-3.5 text-danger" />
          : stage.status === "running" ? <span aria-hidden="true" className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
            <span className="relative h-2 w-2 rounded-full bg-brand" />
          </span>
          : stage.status === "pending_review" || stage.status === "pending_intervention" ? <span aria-hidden="true" className="h-2 w-2 rounded-full bg-warning" />
          : <Circle aria-hidden="true" className="h-3.5 w-3.5 text-foreground-muted" />}
        <span className="sr-only">{stage.label}: {stage.status.replaceAll("_", " ")}</span>
        {index < stages.length - 1 && <span aria-hidden="true" className="h-px w-3 bg-border-strong" />}
      </li>
    ))}
  </ol>;
}

function currentStageTone(row: WorkflowRunRow) {
  const current = row.stages.find((stage) => stage.label === row.currentStage);
  if (current?.status === "completed" || row.status === "completed") return "text-success";
  if (current?.status === "failed" || row.status === "failed") return "text-danger";
  if (current?.status === "pending_review" || current?.status === "pending_intervention" || row.status === "pending_review") return "text-warning";
  if (current?.status === "running") return "text-brand";
  return "text-foreground-muted";
}

export function WorkflowRunTable({ rows }: { rows: WorkflowRunRow[] }) {
  return <Card className="min-w-0 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
    <thead className="border-b border-border bg-surface-subtle text-xs font-medium uppercase tracking-wider text-foreground-muted"><tr>
      <th scope="col" className="w-[25%] px-4 py-3">Run / Repository</th>
      <th scope="col" className="w-[15%] px-4 py-3">Trigger</th>
      <th scope="col" className="w-[30%] px-4 py-3">Workflow Stage</th>
      <th scope="col" className="w-[15%] px-4 py-3">Status / Time</th>
      <th scope="col" className="w-[15%] px-4 py-3 text-right">Action</th>
    </tr></thead>
    <tbody className="divide-y divide-border">{rows.map((row) => <tr key={row.id} className="transition-colors hover:bg-surface-subtle">
      <td className="px-4 py-3"><div className="flex flex-col gap-1"><span className="font-medium text-foreground">{row.title}</span><span className="flex items-center gap-1 text-xs text-foreground-muted"><GitBranch aria-hidden="true" className="h-3.5 w-3.5" />{row.repository}</span></div></td>
      <td className="px-4 py-3 font-mono text-xs text-foreground-secondary">{row.trigger}</td>
      <td className="px-4 py-3"><div className="flex min-w-0 flex-col gap-2"><div className="flex items-center gap-2 text-xs text-foreground-muted"><span>Current:</span><span className={`font-medium ${currentStageTone(row)}`}>{row.currentStage}</span></div><div className="max-w-[320px] overflow-x-auto pb-1"><StagePipeline stages={row.stages} /></div></div></td>
      <td className="px-4 py-3"><Badge tone={statusTone(row.status)}>{row.status.replaceAll("_", " ")}</Badge><div className="mt-1 font-mono text-xs text-foreground-muted">{formatRelativeTime(row.createdAt)}</div></td>
      <td className="px-4 py-3 text-right"><Link href={row.href} className="font-medium text-brand hover:underline">Open run</Link></td>
    </tr>)}</tbody>
  </table></Card>;
}
