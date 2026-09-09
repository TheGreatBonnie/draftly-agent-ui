# Graph Report - draftly-agent-ui  (2026-09-09)

## Corpus Check
- 198 files · ~782,385 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 831 nodes · 1759 edges · 50 communities (44 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7b8c11a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Card
- dependencies
- compilerOptions
- theme-provider.tsx
- overview-cards.tsx
- ui.tsx
- (landing)/page.tsx
- section-subpage.tsx
- request
- observability.ts
- knowledge/page.tsx
- cn
- preferences-form.tsx
- dashboard/review-document.tsx
- use-draft.ts
- Draftly UI — Next.js + TypeScript + Tailwind CSS
- use-workflow-events.ts
- workspace/page.tsx
- reviews-page.tsx
- next.config.ts
- next-env.d.ts
- review-detail-page.tsx
- dashboard/review-actions.tsx
- onboarding-shell.tsx
- evaluations/page.tsx
- github.ts
- client.ts
- Badge
- knowledge.ts
- onboarding.ts
- settings/[section]/page.tsx
- useStepGuard
- reviews.ts
- reviews-subpage.tsx
- knowledge/[section]/page.tsx
- Button
- mock-data.ts
- navigation.ts
- content.ts
- documentation.ts
- evaluation-section.tsx
- proxy.ts

## God Nodes (most connected - your core abstractions)
1. `request()` - 76 edges
2. `Card()` - 30 edges
3. `cn()` - 30 edges
4. `Button()` - 25 edges
5. `PageHeader()` - 25 edges
6. `IconTile()` - 22 edges
7. `Badge()` - 21 edges
8. `Tabs()` - 21 edges
9. `useStepGuard()` - 19 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `RadioDot()` --calls--> `cn()`  [EXTRACTED]
  components/onboarding/preferences-form.tsx → lib/utils.ts
- `ReviewsPage()` --indirect_call--> `toReviewViewModel()`  [INFERRED]
  components/sections/reviews/reviews-page.tsx → lib/reviews.ts
- `useReviews()` --calls--> `listReviews()`  [EXTRACTED]
  hooks/use-reviews.ts → api/observability.ts
- `OnboardingEntryPage()` --calls--> `getOnboardingStatus()`  [EXTRACTED]
  app/(onboarding)/onboarding/page.tsx → api/onboarding.ts
- `DocumentationPage()` --calls--> `useStepGuard()`  [EXTRACTED]
  app/(onboarding)/onboarding/documentation/page.tsx → lib/onboarding/use-step-guard.ts

## Import Cycles
- None detected.

## Communities (50 total, 6 thin omitted)

### Community 0 - "Card"
Cohesion: 0.12
Nodes (7): providers, steps, PageHeader(), Card(), TabItem, Tabs(), workflowSteps

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (48): autoprefixer, @clerk/nextjs, clsx, lucide-react, next, dependencies, @clerk/nextjs, clsx (+40 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 3 - "theme-provider.tsx"
Cohesion: 0.08
Nodes (24): getApiToken(), metadata, metadata, nav, Shell(), useDismissibleMenu(), applyTheme(), getSystemTheme() (+16 more)

### Community 4 - "overview-cards.tsx"
Cohesion: 0.08
Nodes (37): getOverview(), OverviewDays, OverviewSnapshot, ActivityChart(), AttentionItem, AttentionPanel(), ActiveWorkflows(), EvaluationResults() (+29 more)

### Community 5 - "ui.tsx"
Cohesion: 0.17
Nodes (14): ReviewListCounts, agentIcons, agentTones, Page(), slug(), icons, Page(), slug() (+6 more)

### Community 6 - "(landing)/page.tsx"
Cohesion: 0.08
Nodes (20): chain, FeatureSection(), FinalCTA(), Footer(), Hero(), proof, integrations, IntegrationsSection() (+12 more)

### Community 7 - "section-subpage.tsx"
Cohesion: 0.07
Nodes (7): AgentsSubpage(), docRows, DocumentationSubpage(), evalRuns, EvaluationsSubpage(), Section, WorkflowsSubpage()

### Community 8 - "request"
Cohesion: 0.10
Nodes (34): listAgents(), request(), deleteDiscordLink(), getDiscordChannels(), getDiscordInviteUrl(), getDiscordStatus(), getTriggerChannels(), linkDiscordGuild() (+26 more)

### Community 9 - "observability.ts"
Cohesion: 0.08
Nodes (27): EvaluationItem, getActiveJobs(), getEvaluation(), getJobStatus(), getMetricsSnapshot(), getModelPerformance(), getReviewByRunId(), getRoutingDecisions() (+19 more)

### Community 10 - "knowledge/page.tsx"
Cohesion: 0.20
Nodes (6): graphLegend, graphNodes, knowledgeSources, SourceProvider, topics, TinyLink()

### Community 11 - "cn"
Cohesion: 0.06
Nodes (54): getInitializeStatus(), listGitHubRepositories(), retryInitialize(), startInitialize(), InitializePage(), handleRetry(), LIFECYCLE_STAGES, PerStageProgress (+46 more)

### Community 12 - "preferences-form.tsx"
Cohesion: 0.16
Nodes (15): discoverDocumentation(), selectRepository(), RepositoryPage(), handleNext(), cardBase, InfoRow(), sideBubble, tileBubble (+7 more)

### Community 13 - "dashboard/review-document.tsx"
Cohesion: 0.20
Nodes (5): createLineDiff(), DiffLine, ReviewDocument(), ViewMode, views

### Community 14 - "use-draft.ts"
Cohesion: 0.15
Nodes (14): PreferencesForm(), handleSubmit(), Props, WorkspaceForm(), handleSubmit(), clearAllOnboardingDrafts(), emit(), listeners (+6 more)

### Community 15 - "Draftly UI — Next.js + TypeScript + Tailwind CSS"
Cohesion: 0.20
Nodes (9): Component structure, Core routes, Dark mode and semantic design tokens, Draftly UI — Next.js + TypeScript + Tailwind CSS, Notes, Responsive route-backed section tabs, Review workspace integration, Run (+1 more)

### Community 16 - "use-workflow-events.ts"
Cohesion: 0.18
Nodes (11): listRuns(), AgentRun, RunStepSummary, RunSummary, useAgentRuns(), EVENT_TYPES, NodeState, StreamEvent (+3 more)

### Community 17 - "workspace/page.tsx"
Cohesion: 0.20
Nodes (16): configureIntegrations(), configurePreferences(), confirmSources(), createWorkspace(), DocumentationPage(), handleConfirm(), IntegrationsPage(), handleSubmit() (+8 more)

### Community 18 - "reviews-page.tsx"
Cohesion: 0.20
Nodes (8): formatUpdated(), reviewAccent, ReviewRow(), ReviewsPage(), tone(), filterReviewItems(), ReviewFilterOptions, reviewPageInterval()

### Community 23 - "review-detail-page.tsx"
Cohesion: 0.20
Nodes (9): getReview(), Skeleton(), formatDate(), percentage(), ReviewDetailPage(), statusTone(), LiveRefreshState, useLiveRefresh() (+1 more)

### Community 25 - "dashboard/review-actions.tsx"
Cohesion: 0.26
Nodes (8): decideReview(), ReviewDecisionResult, ReviewActions(), submitDecision(), ReviewActionsProps, MockDialog(), buildReviewDecision(), canDecideReview()

### Community 26 - "onboarding-shell.tsx"
Cohesion: 0.29
Nodes (9): OnboardingFooter(), Props, OnboardingShell(), Props, configs, getNextStep(), getPrevStep(), StepConfig (+1 more)

### Community 27 - "evaluations/page.tsx"
Cohesion: 0.13
Nodes (10): runs, TrendRange, trendRanges, trendSeries, available, connected, Page(), slug() (+2 more)

### Community 28 - "github.ts"
Cohesion: 0.22
Nodes (10): ApiError, deleteGitHubInstallation(), getInstallUrl(), linkGitHubInstallation(), listInstallations(), connectGitHub(), GitHubInstallation, GitHubInstallUrl (+2 more)

### Community 29 - "client.ts"
Cohesion: 0.27
Nodes (5): ensureAuthReady(), setApiToken(), setPendingToken(), metadata, AuthTokenSetter()

### Community 30 - "Badge"
Cohesion: 0.20
Nodes (5): activity, quality, toc, Badge(), Progress()

### Community 31 - "knowledge.ts"
Cohesion: 0.23
Nodes (12): getKnowledgeDetail(), getKnowledgeStats(), KnowledgeDetail, KnowledgeFeedback, KnowledgeLink, KnowledgeListItem, KnowledgeSource, KnowledgeStats (+4 more)

### Community 32 - "onboarding.ts"
Cohesion: 0.30
Nodes (10): DiscoveryResult, GitHubConnectPayload, InitializeStatus, IntegrationsPayload, OnboardingState, OnboardingStatus, PreferencesPayload, RepositoryPayload (+2 more)

### Community 34 - "useStepGuard"
Cohesion: 0.23
Nodes (11): completeOnboarding(), getOnboardingStatus(), CompletePage(), GitHubPage(), OnboardingEntryPage(), OPTIONAL_STEPS, REQUIRED_STEPS, STATE_TO_STEP (+3 more)

### Community 35 - "reviews.ts"
Cohesion: 0.18
Nodes (16): ReviewDisplayEvaluation, ReviewEvidenceItem, ReviewSummary, reviewDetailFacts, EMPTY_EVALUATION, normalizeEvaluation(), normalizeFile(), normalizeFiles() (+8 more)

### Community 36 - "reviews-subpage.tsx"
Cohesion: 0.17
Nodes (6): badgeTone(), ReviewsSubpage(), titles, useReviews(), displayStatus(), toReviewViewModel()

### Community 38 - "Button"
Cohesion: 0.26
Nodes (4): Button(), IconTile(), Tone, EmptyState()

### Community 39 - "mock-data.ts"
Cohesion: 0.19
Nodes (7): activityItems, docs, evalCases, evaluationRuns, integrationDetails, Review, reviews

### Community 40 - "navigation.ts"
Cohesion: 0.60
Nodes (3): getNextOnboardingUrl(), getOnboardingUrl(), getPrevOnboardingUrl()

### Community 41 - "content.ts"
Cohesion: 0.29
Nodes (6): ContentChannel, ContentPackage, ContentStatus, ContentVariant, listContent(), reviewContent()

### Community 42 - "documentation.ts"
Cohesion: 0.44
Nodes (7): DocumentationRecord, DocumentationStats, DocumentationStatus, getDocumentation(), getDocumentationStats(), listDocumentation(), useDocumentation

## Knowledge Gaps
- **184 isolated node(s):** `ContentStatus`, `ContentChannel`, `ContentVariant`, `ContentPackage`, `DocumentationStatus` (+179 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `request` to `onboarding.ts`, `useStepGuard`, `overview-cards.tsx`, `content.ts`, `documentation.ts`, `observability.ts`, `preferences-form.tsx`, `cn`, `use-workflow-events.ts`, `workspace/page.tsx`, `review-detail-page.tsx`, `dashboard/review-actions.tsx`, `github.ts`, `client.ts`, `knowledge.ts`?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **Why does `Card()` connect `Card` to `settings/[section]/page.tsx`, `overview-cards.tsx`, `ui.tsx`, `knowledge/[section]/page.tsx`, `mock-data.ts`, `section-subpage.tsx`, `Button`, `knowledge/page.tsx`, `reviews-subpage.tsx`, `reviews-page.tsx`, `review-detail-page.tsx`, `evaluations/page.tsx`, `Badge`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button` to `Card`, `settings/[section]/page.tsx`, `ui.tsx`, `knowledge/[section]/page.tsx`, `mock-data.ts`, `section-subpage.tsx`, `knowledge/page.tsx`, `reviews-page.tsx`, `review-detail-page.tsx`, `dashboard/review-actions.tsx`, `evaluations/page.tsx`, `Badge`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `ContentStatus`, `ContentChannel`, `ContentVariant` to the rest of the system?**
  _184 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Card` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._