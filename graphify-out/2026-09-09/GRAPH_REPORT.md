# Graph Report - draftly-agent-ui  (2026-09-09)

## Corpus Check
- 180 files · ~778,323 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 756 nodes · 1529 edges · 45 communities (38 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a77d8b63`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Card
- dependencies
- compilerOptions
- theme-provider.tsx
- overview-cards.tsx
- section-subpage.tsx
- (landing)/page.tsx
- EvaluationsSubpage
- request
- observability.ts
- knowledge/page.tsx
- initialization-progress.tsx
- cn
- dashboard/review-document.tsx
- ReviewsSubpage
- Draftly UI — Next.js + TypeScript + Tailwind CSS
- use-workflow-events.ts
- onboarding.ts
- reviews/page.tsx
- next.config.ts
- next-env.d.ts
- use-live-refresh.ts
- reviews/[id]/page.tsx
- onboarding-shell.tsx
- evaluations/page.tsx
- github.ts
- client.ts
- [slug]/page.tsx
- knowledge.ts
- settings/[section]/page.tsx
- ui.tsx
- mock-data.ts
- content.ts
- documentation.ts
- (dashboard)/integrations/page.tsx
- evaluation-section.tsx
- proxy.ts

## God Nodes (most connected - your core abstractions)
1. `request()` - 74 edges
2. `cn()` - 30 edges
3. `Card()` - 29 edges
4. `Button()` - 25 edges
5. `PageHeader()` - 24 edges
6. `IconTile()` - 22 edges
7. `Tabs()` - 21 edges
8. `Badge()` - 19 edges
9. `useStepGuard()` - 19 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `GitHubPage()` --calls--> `useStepGuard()`  [EXTRACTED]
  app/(onboarding)/onboarding/github/page.tsx → lib/onboarding/use-step-guard.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  components/onboarding/initialization-progress.tsx → lib/utils.ts
- `TaskRow()` --calls--> `cn()`  [EXTRACTED]
  components/onboarding/initialization-progress.tsx → lib/utils.ts
- `OnboardingEntryPage()` --calls--> `getOnboardingStatus()`  [EXTRACTED]
  app/(onboarding)/onboarding/page.tsx → api/onboarding.ts
- `InitializePage()` --calls--> `useWorkflowEvents()`  [EXTRACTED]
  app/(onboarding)/onboarding/initialize/page.tsx → hooks/use-workflow-events.ts

## Import Cycles
- None detected.

## Communities (45 total, 7 thin omitted)

### Community 0 - "Card"
Cohesion: 0.14
Nodes (10): providers, steps, Badge(), PageHeader(), Card(), IconTile(), TabItem, Tabs() (+2 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (48): autoprefixer, @clerk/nextjs, clsx, lucide-react, next, dependencies, @clerk/nextjs, clsx (+40 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 3 - "theme-provider.tsx"
Cohesion: 0.13
Nodes (14): metadata, nav, Shell(), useDismissibleMenu(), applyTheme(), getSystemTheme(), ResolvedTheme, Theme (+6 more)

### Community 4 - "overview-cards.tsx"
Cohesion: 0.09
Nodes (27): ActivityChart(), AttentionPanel(), AttentionItem, attentionItems, changeItems, evaluationItems, systemItems, workflowItems (+19 more)

### Community 5 - "section-subpage.tsx"
Cohesion: 0.15
Nodes (16): agentIcons, agentTones, Page(), slug(), icons, Page(), slug(), docRows (+8 more)

### Community 6 - "(landing)/page.tsx"
Cohesion: 0.08
Nodes (20): chain, FeatureSection(), FinalCTA(), Footer(), Hero(), proof, integrations, IntegrationsSection() (+12 more)

### Community 7 - "EvaluationsSubpage"
Cohesion: 0.07
Nodes (4): AgentsSubpage(), DocumentationSubpage(), EvaluationsSubpage(), WorkflowsSubpage()

### Community 8 - "request"
Cohesion: 0.10
Nodes (34): listAgents(), request(), deleteDiscordLink(), getDiscordChannels(), getDiscordInviteUrl(), getDiscordStatus(), getTriggerChannels(), linkDiscordGuild() (+26 more)

### Community 9 - "observability.ts"
Cohesion: 0.09
Nodes (24): EvaluationItem, getActiveJobs(), getEvaluation(), getJobStatus(), getMetricsSnapshot(), getModelPerformance(), getReview(), getReviewByRunId() (+16 more)

### Community 10 - "knowledge/page.tsx"
Cohesion: 0.20
Nodes (6): graphLegend, graphNodes, knowledgeSources, SourceProvider, topics, TinyLink()

### Community 11 - "initialization-progress.tsx"
Cohesion: 0.09
Nodes (26): getInitializeStatus(), retryInitialize(), startInitialize(), InitializePage(), handleRetry(), LIFECYCLE_STAGES, PerStageProgress, STAGE_WEIGHTS (+18 more)

### Community 12 - "cn"
Cohesion: 0.08
Nodes (40): discoverDocumentation(), GitHubPage(), WelcomePage(), DesignButton(), FooterBar(), DiscordGlyph(), GithubIcon(), SlackGlyph() (+32 more)

### Community 13 - "dashboard/review-document.tsx"
Cohesion: 0.20
Nodes (5): createLineDiff(), DiffLine, ReviewDocument(), ViewMode, views

### Community 15 - "Draftly UI — Next.js + TypeScript + Tailwind CSS"
Cohesion: 0.22
Nodes (8): Component structure, Core routes, Dark mode and semantic design tokens, Draftly UI — Next.js + TypeScript + Tailwind CSS, Notes, Responsive route-backed section tabs, Run, UI improvements included

### Community 16 - "use-workflow-events.ts"
Cohesion: 0.18
Nodes (11): listRuns(), AgentRun, RunStepSummary, RunSummary, useAgentRuns(), EVENT_TYPES, NodeState, StreamEvent (+3 more)

### Community 17 - "onboarding.ts"
Cohesion: 0.10
Nodes (41): completeOnboarding(), configureIntegrations(), configurePreferences(), confirmSources(), createWorkspace(), getOnboardingStatus(), listGitHubRepositories(), selectRepository() (+33 more)

### Community 18 - "reviews/page.tsx"
Cohesion: 0.29
Nodes (3): reviewAccent, StatusBadge(), tone()

### Community 25 - "reviews/[id]/page.tsx"
Cohesion: 0.24
Nodes (6): Page(), statusTone(), ReviewActions(), SectionTitle(), MockDialog(), reviews

### Community 26 - "onboarding-shell.tsx"
Cohesion: 0.11
Nodes (25): ProgressStepper(), CURRENT_SUBS, DONE_SUBS, FUTURE_SUBS, Logo(), SideRail(), OnboardingFooter(), Props (+17 more)

### Community 27 - "evaluations/page.tsx"
Cohesion: 0.25
Nodes (4): runs, TrendRange, trendRanges, trendSeries

### Community 28 - "github.ts"
Cohesion: 0.18
Nodes (12): ApiError, decideReview(), deleteGitHubInstallation(), getInstallUrl(), linkGitHubInstallation(), listInstallations(), ReviewDecisionResult, connectGitHub() (+4 more)

### Community 29 - "client.ts"
Cohesion: 0.15
Nodes (10): ensureAuthReady(), getApiToken(), setApiToken(), setPendingToken(), metadata, metadata, AuthTokenSetter(), EventHandler (+2 more)

### Community 30 - "[slug]/page.tsx"
Cohesion: 0.33
Nodes (3): activity, quality, toc

### Community 31 - "knowledge.ts"
Cohesion: 0.23
Nodes (12): getKnowledgeDetail(), getKnowledgeStats(), KnowledgeDetail, KnowledgeFeedback, KnowledgeLink, KnowledgeListItem, KnowledgeSource, KnowledgeStats (+4 more)

### Community 37 - "ui.tsx"
Cohesion: 0.15
Nodes (4): Button(), Tone, EmptyState(), Skeleton()

### Community 39 - "mock-data.ts"
Cohesion: 0.14
Nodes (8): tabs, Progress(), activityItems, docs, evalCases, evaluationRuns, knowledgeTopics, Review

### Community 41 - "content.ts"
Cohesion: 0.29
Nodes (6): ContentChannel, ContentPackage, ContentStatus, ContentVariant, listContent(), reviewContent()

### Community 42 - "documentation.ts"
Cohesion: 0.44
Nodes (7): DocumentationRecord, DocumentationStats, DocumentationStatus, getDocumentation(), getDocumentationStats(), listDocumentation(), useDocumentation

### Community 43 - "(dashboard)/integrations/page.tsx"
Cohesion: 0.33
Nodes (5): available, connected, Page(), slug(), integrations

## Knowledge Gaps
- **172 isolated node(s):** `ContentStatus`, `ContentChannel`, `ContentVariant`, `ContentPackage`, `DocumentationStatus` (+167 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `request` to `content.ts`, `documentation.ts`, `observability.ts`, `cn`, `initialization-progress.tsx`, `use-workflow-events.ts`, `onboarding.ts`, `github.ts`, `client.ts`, `knowledge.ts`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `Card()` connect `Card` to `settings/[section]/page.tsx`, `overview-cards.tsx`, `section-subpage.tsx`, `ui.tsx`, `mock-data.ts`, `knowledge/page.tsx`, `(dashboard)/integrations/page.tsx`, `reviews/page.tsx`, `reviews/[id]/page.tsx`, `evaluations/page.tsx`, `[slug]/page.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `Button()` connect `ui.tsx` to `Card`, `settings/[section]/page.tsx`, `section-subpage.tsx`, `mock-data.ts`, `knowledge/page.tsx`, `(dashboard)/integrations/page.tsx`, `reviews/page.tsx`, `reviews/[id]/page.tsx`, `evaluations/page.tsx`, `[slug]/page.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `ContentStatus`, `ContentChannel`, `ContentVariant` to the rest of the system?**
  _172 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Card` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._