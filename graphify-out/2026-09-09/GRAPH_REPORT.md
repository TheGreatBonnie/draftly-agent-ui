# Graph Report - draftly-agent-ui  (2026-09-09)

## Corpus Check
- 99 files · ~752,744 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 376 nodes · 683 edges · 19 communities (14 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1acd454c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ui.tsx
- dependencies
- compilerOptions
- settings/page.tsx
- app/page.tsx
- mock-data.ts
- settings/[section]/page.tsx
- ActivitySubpage
- section-subpage.tsx
- devDependencies
- knowledge/page.tsx
- Global Constraints
- ReviewsSubpage
- reviews/[id]/page.tsx
- Draftly UI — Next.js + TypeScript + Tailwind CSS
- next.config.ts
- next-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `Card()` - 30 edges
2. `Button()` - 28 edges
3. `PageHeader()` - 26 edges
4. `IconTile()` - 23 edges
5. `Tabs()` - 23 edges
6. `Badge()` - 21 edges
7. `compilerOptions` - 17 edges
8. `Progress()` - 15 edges
9. `MetricCard()` - 10 edges
10. `SelectPill()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ActivityChart()` --calls--> `chartDataForRange()`  [EXTRACTED]
  app/page.tsx → lib/dashboard-state.ts
- `Shell()` --calls--> `useTheme()`  [EXTRACTED]
  components/shell.tsx → components/theme-provider.tsx
- `ThemeSwitcher()` --calls--> `useTheme()`  [EXTRACTED]
  components/theme-switcher.tsx → components/theme-provider.tsx

## Import Cycles
- None detected.

## Communities (19 total, 5 thin omitted)

### Community 0 - "ui.tsx"
Cohesion: 0.08
Nodes (21): activity, quality, toc, providers, steps, steps, icons, Page() (+13 more)

### Community 1 - "dependencies"
Cohesion: 0.08
Nodes (24): lucide-react, next, dependencies, lucide-react, next, react, react-dom, react-markdown (+16 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+19 more)

### Community 3 - "settings/page.tsx"
Cohesion: 0.10
Nodes (13): metadata, nav, Shell(), useDismissibleMenu(), applyTheme(), getSystemTheme(), ResolvedTheme, Theme (+5 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.11
Nodes (16): ActivityChart(), attentionItems, changeItems, statusItems, workflowItems, activity14, ActivityPoint, activitySeries (+8 more)

### Community 5 - "mock-data.ts"
Cohesion: 0.06
Nodes (30): iconMap, agentIcons, agentTones, Page(), slug(), runs, TrendRange, trendRanges (+22 more)

### Community 8 - "section-subpage.tsx"
Cohesion: 0.07
Nodes (8): AgentsSubpage(), docRows, DocumentationSubpage(), evalRuns, EvaluationsSubpage(), Section, WorkflowsSubpage(), workflows

### Community 9 - "devDependencies"
Cohesion: 0.13
Nodes (15): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+7 more)

### Community 10 - "knowledge/page.tsx"
Cohesion: 0.17
Nodes (7): graphLegend, graphNodes, knowledgeSources, SourceProvider, topics, TabItem, TinyLink()

### Community 11 - "Global Constraints"
Cohesion: 0.22
Nodes (8): Componentize Draftly Agent UI Implementation Plan, Global Constraints, Task 1: Extract design-system primitives, Task 2: Split global application layout, Task 3: Split section-family components, Task 4: Split review feature components, Task 5: Normalize theme component placement and imports, Task 6: Verify and update graph metadata

### Community 13 - "reviews/[id]/page.tsx"
Cohesion: 0.12
Nodes (10): Page(), statusTone(), MockDialog(), ReviewActions(), createLineDiff(), DiffLine, ReviewDocument(), ViewMode (+2 more)

### Community 15 - "Draftly UI — Next.js + TypeScript + Tailwind CSS"
Cohesion: 0.25
Nodes (7): Core routes, Dark mode and semantic design tokens, Draftly UI — Next.js + TypeScript + Tailwind CSS, Notes, Responsive route-backed section tabs, Run, UI improvements included

## Knowledge Gaps
- **108 isolated node(s):** `iconMap`, `agentIcons`, `agentTones`, `toc`, `quality` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button()` connect `ui.tsx` to `settings/page.tsx`, `app/page.tsx`, `mock-data.ts`, `settings/[section]/page.tsx`, `section-subpage.tsx`, `knowledge/page.tsx`, `reviews/[id]/page.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Card()` connect `ui.tsx` to `settings/page.tsx`, `app/page.tsx`, `mock-data.ts`, `settings/[section]/page.tsx`, `section-subpage.tsx`, `knowledge/page.tsx`, `reviews/[id]/page.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `PageHeader()` connect `ui.tsx` to `settings/page.tsx`, `app/page.tsx`, `mock-data.ts`, `settings/[section]/page.tsx`, `section-subpage.tsx`, `knowledge/page.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `iconMap`, `agentIcons`, `agentTones` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08141321044546851 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._