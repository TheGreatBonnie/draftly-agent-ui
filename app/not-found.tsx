import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button, EmptyState } from "@/components/dashboard/ui";
export default function NotFound() {
  return (
    <EmptyState
      icon={<FileQuestion className="h-7 w-7" />}
      title="Page not found"
      description="This mock Draftly route does not exist or the requested item is unavailable."
      action={
        <Link href="/">
          <Button primary>Return to dashboard</Button>
        </Link>
      }
    />
  );
}
