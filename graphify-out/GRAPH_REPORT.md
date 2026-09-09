# Graph Report - draftly-agent-ui  (2026-09-09)

## Corpus Check
- 188 files · ~779,588 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 774 nodes · 1577 edges · 50 communities (42 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5a625397`
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
- ActivitySubpage
- request
- observability.ts
- knowledge/page.tsx
- initialization-progress.tsx
- use-workflow-events.ts
- dashboard/review-document.tsx
- cn
- Draftly UI — Next.js + TypeScript + Tailwind CSS
- api/types.ts
- workspace/page.tsx
- reviews/page.tsx
- next.config.ts
- next-env.d.ts
- use-live-refresh.ts
- preferences-form.tsx
- constants.ts
- onboarding.ts
- github.ts
- client.ts
- discord.ts
- knowledge.ts
- EvaluationsSubpage
- settings/[section]/page.tsx
- onboarding-shell.tsx
- complete/page.tsx
- ui.tsx
- Button
- WorkflowsSubpage
- Badge
- content.ts
- documentation.ts
- activity/page.tsx
- evaluation-section.tsx
- proxy.ts

## God Nodes (most connected - your core abstractions)
1. `request()` - 74 edges
2. `Card()` - 31 edges
3. `cn()` - 30 edges
4. `Button()` - 26 edges
5. `PageHeader()` - 26 edges
6. `IconTile()` - 24 edges
7. `Tabs()` - 23 edges
8. `Badge()` - 21 edges
9. `useStepGuard()` - 19 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `GitHubPage()` --calls--> `useStepGuard()`  [EXTRACTED]
  app/(onboarding)/onboarding/github/page.tsx → lib/onboarding/use-step-guard.ts
- `StatTile()` --calls--> `cn()`  [EXTRACTED]
  components/onboarding/initialization-progress.tsx → lib/utils.ts
- `TaskRow()` --calls--> `cn()`  [EXTRACTED]
  components/onboarding/initialization-progress.tsx → lib/utils.ts
- `RadioDot()` --calls--> `cn()`  [EXTRACTED]
  components/onboarding/preferences-form.tsx → lib/utils.ts
- `OnboardingEntryPage()` --calls--> `getOnboardingStatus()`  [EXTRACTED]
  app/(onboarding)/onboarding/page.tsx → api/onboarding.ts

## Import Cycles
- None detected.

## Communities (50 total, 8 thin omitted)

### Community 0 - "Card"
Cohesion: 0.12
Nodes (13): providers, steps, PageHeader(), Card(), IconTile(), TabItem, Tabs(), activityItems (+5 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (48): autoprefixer, @clerk/nextjs, clsx, lucide-react, next, dependencies, @clerk/nextjs, clsx (+40 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 3 - "settings/page.tsx"
Cohesion: 0.09
Nodes (15): metadata, metadata, nav, Shell(), useDismissibleMenu(), applyTheme(), getSystemTheme(), ResolvedTheme (+7 more)

### Community 4 - "overview-cards.tsx"
Cohesion: 0.09
Nodes (27): ActivityChart(), AttentionPanel(), AttentionItem, attentionItems, changeItems, evaluationItems, systemItems, workflowItems (+19 more)

### Community 5 - "section-subpage.tsx"
Cohesion: 0.15
Nodes (16): agentIcons, agentTones, Page(), slug(), icons, Page(), slug(), docRows (+8 more)

### Community 6 - "(landing)/page.tsx"
Cohesion: 0.08
Nodes (20): chain, FeatureSection(), FinalCTA(), Footer(), Hero(), proof, integrations, IntegrationsSection() (+12 more)

### Community 7 - "ActivitySubpage"
Cohesion: 0.07
Nodes (4): ActivitySubpage(), AgentsSubpage(), DocumentationSubpage(), ReviewsSubpage()

### Community 8 - "request"
Cohesion: 0.23
Nodes (14): request(), assignRole(), createReviewer(), deleteReviewer(), getReviewer(), listOrgMembers(), listReviewers(), registerSelf() (+6 more)

### Community 9 - "observability.ts"
Cohesion: 0.09
Nodes (24): EvaluationItem, getActiveJobs(), getEvaluation(), getJobStatus(), getMetricsSnapshot(), getModelPerformance(), getReview(), getReviewByRunId() (+16 more)

### Community 10 - "knowledge/page.tsx"
Cohesion: 0.20
Nodes (6): graphLegend, graphNodes, knowledgeSources, SourceProvider, topics, TinyLink()

### Community 11 - "initialization-progress.tsx"
Cohesion: 0.09
Nodes (26): getInitializeStatus(), retryInitialize(), startInitialize(), InitializePage(), handleRetry(), LIFECYCLE_STAGES, PerStageProgress, STAGE_WEIGHTS (+18 more)

### Community 12 - "use-workflow-events.ts"
Cohesion: 0.25
Nodes (6): ApiError, EVENT_TYPES, NodeState, StreamEvent, StreamEventType, StreamStatus

### Community 13 - "dashboard/review-document.tsx"
Cohesion: 0.20
Nodes (5): createLineDiff(), DiffLine, ReviewDocument(), ViewMode, views

### Community 14 - "cn"
Cohesion: 0.14
Nodes (22): discoverDocumentation(), GitHubPage(), WelcomePage(), DesignButton(), FooterBar(), DiscordGlyph(), GithubIcon(), SlackGlyph() (+14 more)

### Community 15 - "Draftly UI — Next.js + TypeScript + Tailwind CSS"
Cohesion: 0.22
Nodes (8): Component structure, Core routes, Dark mode and semantic design tokens, Draftly UI — Next.js + TypeScript + Tailwind CSS, Notes, Responsive route-backed section tabs, Run, UI improvements included

### Community 16 - "api/types.ts"
Cohesion: 0.15
Nodes (15): listAgents(), listRuns(), AgentHistoryEntry, AgentRun, AgentSummary, AssignRolePayload, CreateReviewerPayload, OrgMember (+7 more)

### Community 17 - "workspace/page.tsx"
Cohesion: 0.20
Nodes (20): configureIntegrations(), configurePreferences(), confirmSources(), createWorkspace(), selectRepository(), DocumentationPage(), handleConfirm(), IntegrationsPage() (+12 more)

### Community 18 - "reviews/page.tsx"
Cohesion: 0.29
Nodes (3): reviewAccent, StatusBadge(), tone()

### Community 25 - "preferences-form.tsx"
Cohesion: 0.12
Nodes (20): IntegrationPicker(), AUTOMATION_OPTIONS, PreferencesForm(), handleSubmit(), Props, RadioDot(), REVIEW_OPTIONS, STYLE_OPTIONS (+12 more)

### Community 26 - "constants.ts"
Cohesion: 0.16
Nodes (13): Props, Props, OPTIONAL_STEPS, REQUIRED_STEPS, STEP_LABELS, STEP_ORDER, getNextOnboardingUrl(), getOnboardingUrl() (+5 more)

### Community 27 - "onboarding.ts"
Cohesion: 0.22
Nodes (13): listGitHubRepositories(), Props, RepositoryPicker(), DiscoveryResult, GitHubConnectPayload, InitializeStatus, IntegrationsPayload, OnboardingState (+5 more)

### Community 28 - "github.ts"
Cohesion: 0.22
Nodes (11): decideReview(), deleteGitHubInstallation(), getInstallUrl(), linkGitHubInstallation(), listInstallations(), ReviewDecisionResult, connectGitHub(), GitHubInstallation (+3 more)

### Community 29 - "client.ts"
Cohesion: 0.18
Nodes (9): ensureAuthReady(), getApiToken(), setApiToken(), setPendingToken(), metadata, AuthTokenSetter(), EventHandler, useDashboardEvents() (+1 more)

### Community 30 - "discord.ts"
Cohesion: 0.17
Nodes (11): deleteDiscordLink(), getDiscordChannels(), getDiscordInviteUrl(), getDiscordStatus(), getTriggerChannels(), linkDiscordGuild(), setTriggerChannels(), DiscordChannel (+3 more)

### Community 31 - "knowledge.ts"
Cohesion: 0.23
Nodes (12): getKnowledgeDetail(), getKnowledgeStats(), KnowledgeDetail, KnowledgeFeedback, KnowledgeLink, KnowledgeListItem, KnowledgeSource, KnowledgeStats (+4 more)

### Community 34 - "onboarding-shell.tsx"
Cohesion: 0.25
Nodes (12): ProgressStepper(), CURRENT_SUBS, DONE_SUBS, FUTURE_SUBS, Logo(), SideRail(), OnboardingFooter(), DESIGN_STEP_LABELS (+4 more)

### Community 35 - "complete/page.tsx"
Cohesion: 0.39
Nodes (6): completeOnboarding(), getOnboardingStatus(), CompletePage(), OnboardingEntryPage(), OnboardingComplete(), STATE_TO_STEP

### Community 36 - "ui.tsx"
Cohesion: 0.14
Nodes (4): tabs, EmptyState(), docs, knowledgeTopics

### Community 37 - "Button"
Cohesion: 0.16
Nodes (8): Page(), statusTone(), ReviewActions(), Button(), Tone, MockDialog(), Skeleton(), reviews

### Community 39 - "Badge"
Cohesion: 0.12
Nodes (9): activity, quality, toc, runs, TrendRange, trendRanges, trendSeries, Badge() (+1 more)

### Community 41 - "content.ts"
Cohesion: 0.29
Nodes (6): ContentChannel, ContentPackage, ContentStatus, ContentVariant, listContent(), reviewContent()

### Community 42 - "documentation.ts"
Cohesion: 0.44
Nodes (7): DocumentationRecord, DocumentationStats, DocumentationStatus, getDocumentation(), getDocumentationStats(), listDocumentation(), useDocumentation

### Community 43 - "activity/page.tsx"
Cohesion: 0.20
Nodes (7): iconMap, available, connected, Page(), slug(), SectionTitle(), integrations

## Knowledge Gaps
- **172 isolated node(s):** `ContentStatus`, `ContentChannel`, `ContentVariant`, `ContentPackage`, `DocumentationStatus` (+167 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `request` to `complete/page.tsx`, `content.ts`, `documentation.ts`, `observability.ts`, `initialization-progress.tsx`, `use-workflow-events.ts`, `cn`, `api/types.ts`, `workspace/page.tsx`, `onboarding.ts`, `github.ts`, `client.ts`, `discord.ts`, `knowledge.ts`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `Card()` connect `Card` to `settings/[section]/page.tsx`, `settings/page.tsx`, `ui.tsx`, `section-subpage.tsx`, `Button`, `Badge`, `overview-cards.tsx`, `knowledge/page.tsx`, `activity/page.tsx`, `reviews/page.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `PageHeader()` connect `Card` to `settings/[section]/page.tsx`, `settings/page.tsx`, `ui.tsx`, `section-subpage.tsx`, `overview-cards.tsx`, `Badge`, `Button`, `knowledge/page.tsx`, `activity/page.tsx`, `reviews/page.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `ContentStatus`, `ContentChannel`, `ContentVariant` to the rest of the system?**
  _172 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Card` be split into smaller, more focused modules?**
  _Cohesion score 0.1226890756302521 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._