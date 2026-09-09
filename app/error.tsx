"use client";
import { AlertTriangle } from "lucide-react";
import { Button, EmptyState } from "@/components/dashboard/ui";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-7 w-7" />}
      title="Unable to load this page"
      description="The mock UI hit an unexpected rendering error."
      action={
        <Button primary onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
