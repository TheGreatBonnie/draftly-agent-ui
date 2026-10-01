import test from "node:test";
import assert from "node:assert/strict";
import { setApiToken } from "../api/client.ts";
import { getPageQualitySummary, listQualityPages } from "../api/page-quality.ts";

test("summary wrapper reads the repointed page-quality summary endpoint", async () => {
  const originalFetch = globalThis.fetch;
  const urls: string[] = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    return new Response(
      JSON.stringify({
        average_score: 62,
        total_runs: 2,
        scored_pages: 7,
        total_pages: 9,
        passed: 5,
        needs_revision: 1,
        awaiting_human: 1,
        by_metric: [{ metric: "detail", average_score: 100, sample_count: 7 }],
        trend: [{ date: "2026-09-28", average_score: 62, run_count: 1 }],
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  setApiToken("token");
  const data = await getPageQualitySummary(14);
  assert.equal(data.scored_pages, 7);
  assert.equal(data.total_pages, 9);
  assert.equal(data.by_metric[0].metric, "detail");
  assert.equal(data.trend[0].run_count, 1);
  assert.deepEqual(urls, ["/api/evaluations/summary?days=14"]);
  globalThis.fetch = originalFetch;
});

test("pages wrapper forwards limit and cursor", async () => {
  const originalFetch = globalThis.fetch;
  const urls: string[] = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    return new Response(
      JSON.stringify({
        items: [
          {
            page_id: "p1",
            path: "docs/a.md",
            status: "revision_required",
            score: 40,
            run_id: "r1",
            updated_at: null,
          },
        ],
        total: 1,
        next_cursor: null,
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  setApiToken("token");
  const page = await listQualityPages({ limit: 20, cursor: "0.3:p0:run-9" });
  assert.equal(page.items[0].path, "docs/a.md");
  assert.equal(page.items[0].score, 40);
  assert.equal(urls[0], "/api/evaluations/pages?limit=20&cursor=0.3%3Ap0%3Arun-9");
  globalThis.fetch = originalFetch;
});
