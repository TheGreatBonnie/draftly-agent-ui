import assert from "node:assert/strict";
import test from "node:test";
import { documentationHref, documentationStatusLabel, formatDocumentationDate } from "../lib/documentation-view-model.ts";

test("documentation view model uses stable ids and honest status labels", () => {
  assert.equal(documentationHref("doc/one"), "/documentation/doc%2Fone");
  assert.equal(documentationStatusLabel("indexed"), "Published");
  assert.equal(documentationStatusLabel("stale"), "Stale");
  assert.equal(documentationStatusLabel(null), "Unknown");
});

test("documentation dates fall back to an explicit unavailable state", () => {
  assert.equal(formatDocumentationDate(null), "Not available");
  assert.match(formatDocumentationDate("2026-09-01T00:00:00Z"), /2026/);
});
