import assert from "node:assert/strict";
import test from "node:test";
import {
  buildRepositoryPayload,
  candidateLabel,
  isPublicDocumentation,
} from "../lib/onboarding/source-model.ts";
import {
  parsePathList,
  validatePublicDocsRootUrl,
} from "../lib/onboarding/validation.ts";

test("isPublicDocumentation matches the backend enum string", () => {
  assert.equal(isPublicDocumentation("public_documentation"), true);
  assert.equal(isPublicDocumentation("github_repository"), false);
  assert.equal(isPublicDocumentation(undefined), false);
});

test("buildRepositoryPayload emits source_type and documentation_config", () => {
  const payload = buildRepositoryPayload({
    rootUrl: "https://docs.example.com",
    includePaths: ["docs/**"],
    excludePaths: ["docs/archived/**"],
    crawlInstructions: "Follow the reference pages first",
  });
  assert.equal(payload.source_type, "public_documentation");
  assert.equal(payload.full_name, "docs.example.com");
  assert.deepEqual(payload.documentation_config, {
    root_url: "https://docs.example.com",
    include_paths: ["docs/**"],
    exclude_paths: ["docs/archived/**"],
    crawl_instructions: "Follow the reference pages first",
  });
});

test("buildRepositoryPayload omits empty crawl_instructions", () => {
  const payload = buildRepositoryPayload({
    rootUrl: "https://docs.example.com",
    includePaths: [],
    excludePaths: [],
    crawlInstructions: "   ",
  });
  assert.equal("crawl_instructions" in (payload.documentation_config ?? {}), false);
});

test("candidateLabel shows file name for repo paths", () => {
  assert.equal(candidateLabel("docs/guides/auth.md"), "auth.md");
});

test("candidateLabel shows last path segment or hostname for URLs", () => {
  assert.equal(candidateLabel("https://docs.example.com/getting-started"), "getting-started");
  assert.equal(candidateLabel("https://docs.example.com"), "docs.example.com");
});

test("validatePublicDocsRootUrl rejects empty, non-https, and credentialed roots", () => {
  assert.ok(validatePublicDocsRootUrl(""));
  assert.ok(validatePublicDocsRootUrl("http://docs.example.com"));
  assert.ok(validatePublicDocsRootUrl("https://user:pass@docs.example.com"));
  assert.equal(validatePublicDocsRootUrl("https://docs.example.com"), null);
});

test("parsePathList splits on newlines and commas and trims", () => {
  assert.deepEqual(parsePathList("docs/**\n, guides/** , "), ["docs/**", "guides/**"]);
});