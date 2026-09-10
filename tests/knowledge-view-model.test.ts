import assert from "node:assert/strict";
import test from "node:test";
import { formatKnowledgeCount, formatKnowledgeTime, knowledgeItemTitle, knowledgeStatusLabel } from "../lib/knowledge-view-model.ts";

test("Knowledge view models format persisted data without static fallbacks", () => {
  assert.equal(formatKnowledgeCount(1248), "1,248");
  assert.equal(formatKnowledgeCount(null), "0");
  assert.equal(formatKnowledgeTime("2026-09-10T11:00:00Z", new Date("2026-09-10T12:00:00Z")), "1h ago");
  assert.equal(formatKnowledgeTime(null), "Unknown");
  assert.equal(knowledgeStatusLabel("needs-verification"), "Needs verification");
  assert.equal(knowledgeItemTitle({ id: "1", entity: null, description: null, status: "stale", importance: null, confidence: null, created_at: null, updated_at: null, namespace: "knowledge", memory_type: "fact" }), "Untitled knowledge item");
});
