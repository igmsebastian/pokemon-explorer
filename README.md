# Pokemon Explorer

Pokemon Explorer is a frontend examination project built as a modern Pokemon Research Lab and Pokedex command center. It uses PokeAPI for server data, TanStack Query for caching, and Zustand for client-only Team Lab state.

## Tech Stack

- React, TypeScript, and Vite
- Tailwind CSS and shadcn/ui primitives
- TanStack Query
- Zustand with persist middleware
- Zod for practical API response validation
- React Router
- Playwright E2E tests
- Fetch API only

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Variables

Runtime configuration lives in `.env`. Keep `.env` local and use `.env.example`
as the shared template.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_POKE_API_BASE_URL` | No | `https://pokeapi.co/api/v2` | Base URL for the Pokemon API. Update this when switching API hosts or versions. |
| `VITE_QUERY_RETRY` | No | `2` | Default TanStack Query retry count. Values are clamped from `0` to `5`. |
| `VITE_QUERY_STALE_TIME_MS` | No | `300000` | Default query stale time in milliseconds. |
| `VITE_QUERY_GC_TIME_MS` | No | `1800000` | Default query garbage collection time in milliseconds. |
| `VITE_QUERY_REFETCH_ON_WINDOW_FOCUS` | No | `false` | Controls whether cached queries refetch when the browser window regains focus. |
| `VITE_POKEMON_LIST_PAGE_SIZE` | No | `20` | Pokemon list batch size. Values are clamped from `1` to `50` to avoid excessive API requests. |
| `VITE_POKEMON_CATALOG_STALE_TIME_MS` | No | `1800000` | Cache freshness for Pokemon catalog and type-filter lookups. |
| `VITE_POKEMON_TYPE_STALE_TIME_MS` | No | `3600000` | Cache freshness for the Pokemon type list. |
| `VITE_POKEMON_SEARCH_DEBOUNCE_MS` | No | `250` | Search debounce delay in milliseconds. Values are clamped from `0` to `1000`. |

Vite exposes only variables prefixed with `VITE_` to the browser. After changing
`.env`, restart `npm run dev`. The app also defines safe defaults in
`src/shared/config/env.ts`, so it still runs if optional values are missing or
malformed.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run test:e2e
npm run test:e2e:ui
npm run check
```

## Features

- Responsive Pokemon grid with official artwork, Pokedex ID, type badges, and type-colored hover treatment
- Name search and type filtering
- Infinite list loading through TanStack Query
- Pokemon detail route at `/pokemon/:name`
- Detail profile with artwork, stats, abilities, moves, species notes, and evolution chain
- Skeleton, empty, cached refresh, and error states
- Mobile-friendly header and navigation

## Team Lab

`/team-lab` is the main creative feature. Users can add Pokemon to a persisted six-slot battle party, release individual members, reset the party, and stack duplicates while the readiness score guides team balance.

The Team Lab calculates:

- Type coverage summary
- Weakness pressure summary
- Strongest represented types
- Missing coverage hints
- Balance score from 0 to 100
- Lightweight party matchup snapshot
- Battle preview with fastest Pokemon, power lead, and weakness risk

Balance scoring is based on party size, type diversity, coverage, duplicate primary types, and weakness pressure. Labels are `No Party Yet`, `Needs Training`, `Balanced Rookie`, `Elite Party`, and `Champion Ready`.

## API Notes

The API base URL is read from `VITE_POKE_API_BASE_URL` through the shared app config. All requests go through the shared `apiFetch<T>()` helper and use Fetch API only.

Important responses are validated with Zod, including Pokemon list, Pokemon detail, species, type details, and evolution chains. TanStack Query owns server state and caches list/detail/species/evolution requests with stable query keys. Query retries, stale time, garbage collection, refetch-on-focus behavior, and Pokemon list page size are configurable through env values with practical defaults. Playwright tests read the same API base URL so mocked network routes stay aligned with the app configuration.

## Architecture

The source follows Feature-Sliced Design:

```txt
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
```

Pages compose widgets and features. Pokemon API logic lives in `entities/pokemon/api`, Pokemon domain UI lives in `entities/pokemon/ui`, client Team Lab state lives in `features/build-team`, and shared primitives live behind `shared/ui`.

## Testing

Playwright tests live in `tests/`:

- `pokemon-list.spec.ts`
- `pokemon-detail.spec.ts`
- `team-lab.spec.ts`

The tests mock PokeAPI responses at the browser network layer, so they are deterministic while still exercising the app through real UI flows. Playwright starts Vite automatically through `webServer`.

## Quality Gates

Run this before submission:

```bash
npm run lint
npm run build
npm run test:e2e
```
