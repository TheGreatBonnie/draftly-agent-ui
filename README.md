# Draftly UI — Next.js + TypeScript + Tailwind CSS

High-fidelity frontend for Draftly, based on the supplied UI designs. The review workspace, agents observability, and Knowledge pages read organization-scoped data from the Draftly backend; other prototype surfaces may still use local mock data.

## Review workspace integration

The review routes (`/reviews`, `/reviews/[id]`, and their status subroutes) require the running `draftly-agent-backend`, Clerk token setup for the active organization, and the `API_URL` rewrite so browser requests reach the backend. Review decisions are persisted through the backend GitHub review endpoint; they are not local-only actions.

## Agents observability integration

`/agents`, `/agents/active`, `/agents/idle`, and `/agents/[id]` use the authenticated `/api/agents` catalog and organization-scoped telemetry endpoints. The catalog is code-defined by the backend; configurable agent creation, editing, and deletion are not exposed. Agent detail hydrates historical steps from `/api/runs/{run_id}/steps` and subscribes to the existing Redis/SSE workflow stream for a selected run. The backend and Redis event stream must be reachable through the same authenticated API rewrite, and the Clerk token must contain the active organization.

## Knowledge integration

`/knowledge` and its subroutes use the authenticated `/api/knowledge` read model. The overview loads organization-scoped counts, recent items, provenance summaries, graph nodes, and topic aggregates. Documents support bounded semantic search; `/knowledge/item/[id]` displays the item detail, sources, relations, and feedback. The backend and API rewrite must be reachable, and the Clerk token must contain the active organization.

Knowledge source cards represent persisted provenance evidence, not whether an integration is currently connected. Add/import source actions remain intentionally unavailable until the corresponding backend mutation and integration-health contracts are implemented.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Core routes

- `/` — Overview dashboard
- `/knowledge` — Knowledge overview
- `/knowledge/documents`, `/knowledge/sources`, `/knowledge/graph`, `/knowledge/topics`, `/knowledge/embeddings`
- `/activity` and `/activity/[id]`
- `/reviews` and `/reviews/[id]`
- `/evaluations`, `/evaluations/runs/[runId]`, `/evaluations/test-cases/[caseId]`
- `/documentation`, `/documentation/[slug]`, `/documentation/[slug]/edit`
- `/workflows`, `/workflows/new`, `/workflows/[id]`, `/workflows/[id]/runs/[runId]`
- `/agents`, `/agents/new`, `/agents/[id]`
- `/integrations`, `/integrations/add`, `/integrations/[provider]`
- `/settings` plus organization, models, GitHub, notifications, security, billing, advanced, and audit subpages
- `/system` — system health
- `/onboarding` — first-run setup flow

## UI improvements included

- Responsive horizontal tabs with touch scrolling on every tabbed page
- Responsive mobile navigation drawer
- Global command/search overlay and notification panel
- Provider-specific and role-specific Lucide icons matching the visual language of the designs
- Workflow detail and run trace pages
- Agent catalog, detail, historical run, and selected-run live activity pages
- Evaluation run and test-case detail pages using Strands Eval SDK-oriented mock data
- Activity event detail pages
- Integration configuration and add-integration flow
- Knowledge documents, sources, graph, topics, and embedding-coverage pages backed by live organization-scoped reads
- Settings subpages for organization, model routing, GitHub, notifications, security, billing, advanced configuration, and audit logs
- Documentation detail editor with preview, evidence, and AI suggestions
- Review action confirmation/feedback dialogs backed by the Draftly API
- System status and onboarding pages
- Global loading, error, and not-found states
- Mock datasets in `lib/mock-data.ts`

## Notes

Non-review prototype routes may still use local mock data. The review, agents, and Knowledge routes are integrated with the authenticated Draftly API and require the backend setup described above.


## Dark mode and semantic design tokens

The UI now uses a persisted `light | dark | system` theme with an inline pre-hydration theme script to avoid flashing the wrong theme. Semantic tokens live in `app/globals.css` and are exposed through Tailwind in `tailwind.config.ts` for backgrounds, surfaces, foregrounds, borders, brand, status colors, inputs, code surfaces, chart grids, rings, and shadows. The header theme button toggles light/dark mode, while Settings → General exposes Light, Dark, and System choices.

Prefer semantic utilities for new UI (`bg-background`, `bg-surface`, `text-foreground`, `text-foreground-muted`, `border-border`, `bg-brand-soft`, `text-brand`) instead of hard-coded slate/white values. A compatibility bridge in `globals.css` also darkens the existing screenshot-matched Tailwind utilities.

## Responsive route-backed section tabs

The following top-level areas use horizontally scrollable responsive tabs that map to real routes and mock-driven subpages:

- Activity: `/activity/document-changes`, `/activity/workflow-runs`, `/activity/evaluations`, `/activity/support`, `/activity/system`
- Reviews: `/reviews/pending`, `/reviews/needs-attention`, `/reviews/approved`, `/reviews/rejected`
- Evaluations: `/evaluations/runs`, `/evaluations/test-cases`, `/evaluations/datasets`, `/evaluations/evaluators`, `/evaluations/trends`
- Documentation: `/documentation/by-repository`, `/documentation/by-topic`, `/documentation/outdated`, `/documentation/recently-updated`
- Workflows: `/workflows/active`, `/workflows/paused`, `/workflows/drafts`, `/workflows/templates`
- Agents: `/agents/active`, `/agents/idle`

The shared route configuration is in `components/dashboard/section-tabs.tsx`; agents use focused components in `components/sections/agents/` and do not import the legacy agent mock dataset.

## Component structure

The UI is organized into focused boundaries:

- `components/primitives/` contains reusable visual primitives. `components/ui.tsx` remains as a compatibility barrel for existing routes.
- `components/layout/` contains the application-shell entry point.
- `components/sections/` contains route-family entry points for activity, reviews, evaluations, documentation, workflows, and agents.
- `components/features/` contains domain-specific review components.
- `components/theme/` contains the theme feature entry point.

New code should import from these focused directories instead of adding more exports to `components/ui.tsx` or `components/shell.tsx`.
