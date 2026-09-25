export interface RunPage<T> {
  items: T[];
  total: number;
  next_cursor: string | null;
}

/** Reload contiguous pages through the last run the user had loaded. */
export async function fetchWorkflowRunWindow<T extends { id: string }>(
  fetchPage: (cursor?: string) => Promise<RunPage<T>>,
  lastLoadedId: string | null,
): Promise<RunPage<T>> {
  const items: T[] = [];
  let cursor: string | undefined;
  let total = 0;
  let nextCursor: string | null = null;
  do {
    const page = await fetchPage(cursor);
    items.push(...page.items);
    total = page.total;
    nextCursor = page.next_cursor;
    if (!lastLoadedId || items.some((item) => item.id === lastLoadedId)) break;
    cursor = nextCursor ?? undefined;
  } while (nextCursor);
  return { items, total, next_cursor: nextCursor };
}
