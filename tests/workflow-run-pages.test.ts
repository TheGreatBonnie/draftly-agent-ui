import test from "node:test";
import assert from "node:assert/strict";
import { fetchWorkflowRunWindow } from "../lib/workflow-run-pages.ts";

test("refresh follows the prior last run when new runs shift page boundaries", async () => {
  const ids = ["new-1", "new-2", "old-1", "old-2", "old-3", "old-4"];
  const pages: Record<string, { items: { id: string }[]; next_cursor: string | null; total: number }> = {
    first: { items: ids.slice(0, 2).map((id) => ({ id })), next_cursor: "second", total: 6 },
    second: { items: ids.slice(2, 4).map((id) => ({ id })), next_cursor: "third", total: 6 },
    third: { items: ids.slice(4).map((id) => ({ id })), next_cursor: null, total: 6 },
  };
  const result = await fetchWorkflowRunWindow((cursor) => Promise.resolve(pages[cursor ?? "first"]), "old-4");
  assert.deepEqual(result.items.map((item) => item.id), ids);
  assert.equal(result.next_cursor, null);
});
