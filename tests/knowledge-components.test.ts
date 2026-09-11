import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Knowledge routes use live controllers and a non-conflicting detail route", async () => {
  const overview = await readFile("app/(dashboard)/knowledge/page.tsx", "utf8");
  const sections = await readFile("app/(dashboard)/knowledge/[section]/page.tsx", "utf8");
  const detail = await readFile("app/(dashboard)/knowledge/item/[id]/page.tsx", "utf8");
  const components = await readFile("components/sections/knowledge/knowledge-components.tsx", "utf8");

  assert.doesNotMatch(overview, /mock-data/);
  assert.doesNotMatch(sections, /mock-data/);
  assert.match(detail, /KnowledgeDetailView/);
  assert.match(components, /useKnowledge\(/);
  assert.match(components, /useKnowledgeSurfaces\(/);
});
