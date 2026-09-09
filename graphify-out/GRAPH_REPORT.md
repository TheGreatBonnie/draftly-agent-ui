# Graph Report - draftly-agent-ui  (2026-09-09)

## Corpus Check
- 180 files · ~778,379 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 757 nodes · 1531 edges · 48 communities (41 shown, 7 thin omitted)
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
- settings/page.tsx
- overview-cards.tsx
- section-subpage.tsx
- (landing)/page.tsx
- DocumentationSubpage
- request
- observability.ts
- Tabs
- initialization-progress.tsx
- cn
- dashboard/review-document.tsx
- preferences-form.tsx
- Draftly UI — Next.js + TypeScript + Tailwind CSS
- use-workflow-events.ts
- workspace/page.tsx
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
- onboarding.ts
- settings/[section]/page.tsx
- constants.ts
- EvaluationsSubpage
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
- `OnboardingEntryPage()` --calls--> `getOnboardingStatus()`  [EXTRACTED]
  app/(onboarding)/onboarding/page.tsx → api/onboarding.ts
- `GitHubPage()` --calls--> `useStepGuard()`  [EXTRACTED]
  app/(onboarding)/onboarding/github/page.tsx → lib/onboarding/use-step-guard.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  components/onboarding/initialization-progress.tsx → lib/utils.ts
- `TaskRow()` --calls--> `cn()`  [EXTRACTED]
  components/onboarding/initialization-progress.tsx → lib/utils.ts
- `RadioDot()` --calls--> `cn()`  [EXTRACTED]
  components/onboarding/preferences-form.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (48 total, 7 thin omitted)

### Community 0 - "Card"
Cohesion: 0.15
Nodes (7): providers, steps, PageHeader(), Card(), IconTile(), Tone, workflowSteps

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (48): autoprefixer, @clerk/nextjs, clsx, lucide-react, next, dependencies, @clerk/nextjs, clsx (+40 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 3 - "settings/page.tsx"
Cohesion: 0.10
Nodes (14): metadata, nav, Shell(), useDismissibleMenu(), applyTheme(), getSystemTheme(), ResolvedTheme, Theme (+6 more)

### Community 4 - "overview-cards.tsx"
Cohesion: 0.09
Nodes (28): ActivityChart(), AttentionPanel(), AttentionItem, attentionItems, changeItems, evaluationItems, systemItems, workflowItems (+20 more)

### Community 5 - "section-subpage.tsx"
Cohesion: 0.14
Nodes (16): agentIcons, agentTones, Page(), slug(), icons, Page(), slug(), docRows (+8 more)

### Community 6 - "(landing)/page.tsx"
Cohesion: 0.08
Nodes (20): chain, FeatureSection(), FinalCTA(), Footer(), Hero(), proof, integrations, IntegrationsSection() (+12 more)

### Community 7 - "DocumentationSubpage"
Cohesion: 0.07
Nodes (4): AgentsSubpage(), DocumentationSubpage(), ReviewsSubpage(), WorkflowsSubpage()

### Community 8 - "request"
Cohesion: 0.10
Nodes (34): listAgents(), request(), deleteDiscordLink(), getDiscordChannels(), getDiscordInviteUrl(), getDiscordStatus(), getTriggerChannels(), linkDiscordGuild() (+26 more)

### Community 9 - "observability.ts"
Cohesion: 0.09
Nodes (24): EvaluationItem, getActiveJobs(), getEvaluation(), getJobStatus(), getMetricsSnapshot(), getModelPerformance(), getReview(), getReviewByRunId() (+16 more)

### Community 10 - "Tabs"
Cohesion: 0.14
Nodes (9): graphLegend, graphNodes, knowledgeSources, SourceProvider, topics, MetricCard(), TabItem, Tabs() (+1 more)

### Community 11 - "initialization-progress.tsx"
Cohesion: 0.09
Nodes (26): getInitializeStatus(), retryInitialize(), startInitialize(), InitializePage(), handleRetry(), LIFECYCLE_STAGES, PerStageProgress, STAGE_WEIGHTS (+18 more)

### Community 12 - "cn"
Cohesion: 0.14
Nodes (23): discoverDocumentation(), GitHubPage(), WelcomePage(), DesignButton(), FooterBar(), DiscordGlyph(), GithubIcon(), SlackGlyph() (+15 more)

### Community 13 - "dashboard/review-document.tsx"
Cohesion: 0.20
Nodes (5): createLineDiff(), DiffLine, ReviewDocument(), ViewMode, views

### Community 14 - "preferences-form.tsx"
Cohesion: 0.11
Nodes (21): sideBubble, IntegrationPicker(), AUTOMATION_OPTIONS, PreferencesForm(), handleSubmit(), Props, RadioDot(), REVIEW_OPTIONS (+13 more)

### Community 15 - "Draftly UI — Next.js + TypeScript + Tailwind CSS"
Cohesion: 0.22
Nodes (8): Component structure, Core routes, Dark mode and semantic design tokens, Draftly UI — Next.js + TypeScript + Tailwind CSS, Notes, Responsive route-backed section tabs, Run, UI improvements included

### Community 16 - "use-workflow-events.ts"
Cohesion: 0.18
Nodes (11): listRuns(), AgentRun, RunStepSummary, RunSummary, useAgentRuns(), EVENT_TYPES, NodeState, StreamEvent (+3 more)

### Community 17 - "workspace/page.tsx"
Cohesion: 0.18
Nodes (23): completeOnboarding(), configureIntegrations(), configurePreferences(), confirmSources(), createWorkspace(), getOnboardingStatus(), selectRepository(), CompletePage() (+15 more)

### Community 18 - "reviews/page.tsx"
Cohesion: 0.29
Nodes (3): reviewAccent, StatusBadge(), tone()

### Community 25 - "reviews/[id]/page.tsx"
Cohesion: 0.24
Nodes (6): Page(), statusTone(), ReviewActions(), SectionTitle(), MockDialog(), reviews

### Community 26 - "onboarding-shell.tsx"
Cohesion: 0.16
Nodes (18): ProgressStepper(), CURRENT_SUBS, DONE_SUBS, FUTURE_SUBS, SideRail(), OnboardingFooter(), Props, Props (+10 more)

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

### Community 32 - "onboarding.ts"
Cohesion: 0.22
Nodes (13): listGitHubRepositories(), Props, RepositoryPicker(), DiscoveryResult, GitHubConnectPayload, InitializeStatus, IntegrationsPayload, OnboardingState (+5 more)

### Community 34 - "constants.ts"
Cohesion: 0.21
Nodes (8): OnboardingEntryPage(), OPTIONAL_STEPS, STATE_TO_STEP, STEP_LABELS, STEP_ORDER, getNextOnboardingUrl(), getOnboardingUrl(), getPrevOnboardingUrl()

### Community 37 - "ui.tsx"
Cohesion: 0.13
Nodes (5): tabs, Button(), EmptyState(), Skeleton(), knowledgeTopics

### Community 39 - "mock-data.ts"
Cohesion: 0.19
Nodes (7): Badge(), Progress(), activityItems, evalCases, evaluationRuns, integrationDetails, Review

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

- **Why does `request()` connect `request` to `onboarding.ts`, `content.ts`, `documentation.ts`, `observability.ts`, `cn`, `initialization-progress.tsx`, `use-workflow-events.ts`, `workspace/page.tsx`, `github.ts`, `client.ts`, `knowledge.ts`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `Card()` connect `Card` to `settings/[section]/page.tsx`, `settings/page.tsx`, `overview-cards.tsx`, `section-subpage.tsx`, `ui.tsx`, `mock-data.ts`, `Tabs`, `(dashboard)/integrations/page.tsx`, `reviews/page.tsx`, `reviews/[id]/page.tsx`, `evaluations/page.tsx`, `[slug]/page.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `PageHeader()` connect `Card` to `settings/[section]/page.tsx`, `settings/page.tsx`, `overview-cards.tsx`, `section-subpage.tsx`, `ui.tsx`, `mock-data.ts`, `Tabs`, `(dashboard)/integrations/page.tsx`, `reviews/page.tsx`, `evaluations/page.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `ContentStatus`, `ContentChannel`, `ContentVariant` to the rest of the system?**
  _172 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `settings/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1010752688172043 - nodes in this community are weakly interconnected._