# Pokemon Explorer Core

## Project Overview

Pokemon Explorer is a creative frontend examination project built around the
PokeAPI. It presents a modern Pokemon research lab experience where users can
explore Pokemon, inspect detailed profiles, and build a battle-ready party.

The main creative feature is Team Lab, which turns saved Pokemon into a Battle
Party with readiness scoring, type effectiveness notes, matchup snapshots, and a
lightweight battle preview.

## Tech Stack

- React latest stable
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Radix primitives through shadcn/ui
- TanStack Query / React Query
- Zustand
- Zod
- Fetch API only
- React Router
- Playwright
- PokeAPI

Project constraints:

- No Axios
- No backend API
- No Prisma or database
- PokeAPI is the source of truth for Pokemon server data

## Source Folder Structure

The app follows a Feature-Sliced Design style inside `src/`:

```txt
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
```

Layer responsibilities:

- `app/` contains global providers, routing, and app setup.
- `pages/` contains route-level page composition.
- `widgets/` contains larger composed UI blocks such as the header, Pokemon grid,
  search panel, and Team Lab panel.
- `features/` contains user-facing actions and feature logic, such as team
  building, theme switching, filtering, and comparison behavior.
- `entities/` contains Pokemon domain models, Pokemon API hooks, Pokemon-specific
  UI, and Pokemon-specific utilities.
- `shared/` contains reusable utilities, shared UI exports, app configuration,
  and shared API helpers.

Pages should compose widgets, features, and entities. They should not own API
details or heavy business logic.

## shadcn/ui Usage

Use shadcn/ui for consistent, accessible UI primitives. Components are generated
under the configured shadcn path and then treated as local source code.

Common add commands:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add sheet
npx shadcn@latest add alert-dialog
```

Prefer existing shadcn components before creating new primitives. Reusable app
wrappers should live in `shared/ui`; Pokemon-specific UI should live in
`entities/pokemon/ui`.

## API Layer

The app uses PokeAPI as the source of truth. The base URL is configured through
environment variables:

```env
VITE_POKE_API_BASE_URL=https://pokeapi.co/api/v2
```

All API requests go through the shared Fetch helper. Important responses are
validated with Zod where the app relies on specific response shape.

TanStack Query owns server state:

- Pokemon list uses infinite loading.
- Pokemon detail, species, and evolution chain use `useQuery`.
- Query keys are stable and grouped under Pokemon query key helpers.
- Queries use practical stale times, garbage collection times, retry settings,
  and disabled refetch-on-focus defaults.

Rate-limit awareness:

- Fetch list data in small batches.
- Avoid fetching every Pokemon detail at once.
- Use dependent queries with `enabled`.
- Reuse cached data instead of invalidating without reason.
- Use Fetch API only.

## State Management

- Server state belongs to TanStack Query.
- Client state belongs to Zustand.
- Team Lab / Battle Party state persists with localStorage.
- Theme mode persists locally and applies the root `dark` class when needed.

Zustand should not be used for PokeAPI server data. TanStack Query should not be
used for purely local UI state.

## Main Features

- Explore page with Pokemon cards, artwork, Pokedex ID, type badges, search,
  type filtering, loading states, empty states, error states, and infinite list
  loading.
- Pokemon detail page with artwork, ID, types, metrics, abilities, moves, stats,
  species copy, and highlighted evolution chain.
- Team Lab with a persisted Battle Party.
- Type Effectiveness summary for coverage, weakness pressure, and missing
  coverage hints.
- Party Matchup Snapshot comparing the strongest party members by total stats.
- Battle Preview with average stats, fastest Pokemon, power lead, and risk
  messaging.
- Theme switcher supporting dark, light, and system modes.
- Responsive mobile bottom navigation with Explore, Mystery or Active Pokemon,
  and My Team.
