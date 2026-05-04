## Project Context

This is a frontend examination project called **Pokemon Explorer**.

The goal is to build a creative, polished, and working Pokemon exploration app using the PokeAPI.

Prioritize:
1. Working features
2. Clean TypeScript code
3. Creative UI/UX
4. Proper TanStack Query usage
5. Simple but impressive architecture

Do not over-engineer.

---

## Tech Stack

Use only:

- React latest stable version
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query / React Query
- Zustand
- Zod
- Fetch API only
- React Router
- Playwright for E2E tests

Do not use:

- Axios
- Prisma
- Backend API
- Redux
- Next.js
- Unnecessary UI libraries

---

## Architecture

Follow Feature-Sliced Design.

Preferred structure:

```txt
src/
  app/
    providers/
    router/
    styles/

  pages/
    home/
    pokemon-detail/
    team-lab/
    compare/

  widgets/
    app-header/
    pokemon-grid/
    pokemon-search-panel/
    team-builder-panel/

  features/
    search-pokemon/
    filter-pokemon/
    build-team/
    compare-pokemon/

  entities/
    pokemon/
      api/
      model/
      ui/
      lib/

  shared/
    api/
    lib/
    ui/
````

Rules:

* Pages compose features/widgets/entities only.
* API logic belongs in `entities/*/api` or `shared/api`.
* Reusable UI belongs in `shared/ui`.
* Pokemon domain UI belongs in `entities/pokemon/ui`.
* Feature logic belongs in `features/*`.
* Zustand stores should be used only for client-side app state.
* Do not put API calls directly inside components unless there is a strong reason.

---

## Coding Standards

Use:

* TypeScript strict style
* descriptive variable names
* small focused components
* clear file names
* named exports where practical
* reusable utilities
* Zod schemas for important API responses

Avoid:

* `any`
* duplicated API calls
* business logic inside JSX
* large components
* magic strings when constants make sense
* console spam
* dead code

---

## API Rules

Use Fetch API only.

Base API:

```ts
export const POKE_API_BASE_URL = "https://pokeapi.co/api/v2"
```

Use a shared fetch helper:

```ts
export async function apiFetch<T>(
  url: string,
  schema?: ZodSchema<T>
): Promise<T>
```

Use Zod validation for important responses, especially:

* Pokemon detail
* Pokemon list
* Pokemon species
* Evolution chain when practical

---

## TanStack Query Rules

Use TanStack Query for all server data.

Required hooks:

* `usePokemonList`
* `usePokemonDetail`
* `usePokemonSpecies`
* `useEvolutionChain`

Use stable query keys:

```ts
export const pokemonQueryKeys = {
  all: ["pokemon"] as const,
  lists: () => [...pokemonQueryKeys.all, "list"] as const,
  list: (params: object) => [...pokemonQueryKeys.lists(), params] as const,
  detail: (nameOrId: string) => [...pokemonQueryKeys.all, "detail", nameOrId] as const,
  species: (nameOrId: string) => [...pokemonQueryKeys.all, "species", nameOrId] as const,
  evolution: (url: string) => [...pokemonQueryKeys.all, "evolution", url] as const,
}
```

Always handle:

* loading state
* error state
* empty state
* cached state

---

## Zustand Rules

Use Zustand for:

* Team Lab state
* comparison selections
* optional favorites

Use persist middleware for Team Lab.

Team Lab rules:

* max 6 Pokemon
* no duplicates
* allow remove
* allow clear
* persist to localStorage

---

## UI Rules

Use Tailwind CSS and shadcn/ui.

Use shadcn/ui components where practical:

* Button
* Card
* Badge
* Input
* Select
* Tabs
* Dialog / Sheet
* Skeleton
* Progress
* Tooltip
* Separator

Design style:

* modern Pokédex / Pokemon Research Lab
* clean spacing
* responsive layout
* polished cards
* smooth hover states
* skeleton loading
* empty states
* error states

---

## Pokemon Color System

Use these colors:

```ts
pokemon: {
  red: "#FF0000",
  yellow: "#FFCB05",
  blue: "#3B4CCA",
  white: "#FFFFFF",
  dark: "#1F2937"
}
```

Use dynamic Pokemon type colors:

```ts
export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC"
}
```

Use type colors for:

* badges
* Pokemon cards
* detail accents
* Team Lab visuals

---

## Testing Rules

Use Playwright for E2E tests.

Test important user flows:

* homepage loads
* Pokemon list displays
* search works
* Pokemon detail page opens
* stats section is visible
* evolution section is visible when available
* Team Lab opens
* Pokemon can be added to team
* duplicates are prevented
* max team size is 6
* team persists after reload

Use stable selectors:

```tsx
data-testid="pokemon-card"
data-testid="pokemon-search-input"
data-testid="pokemon-detail-title"
data-testid="team-lab-page"
data-testid="team-count"
data-testid="add-to-team-button"
data-testid="remove-from-team-button"
```

Prefer:

* `getByRole`
* `getByTestId`
* `expect(locator).toBeVisible()`

Avoid fixed timeouts.

---

## Commands

Before considering work complete, run:

```bash
npm run build
npm run test:e2e
```

If lint/typecheck scripts exist, also run them.

---

## Final Reminder

This is an exam project.

Do not build unnecessary complexity.

Make it:

* clean
* working
* creative
* polished
* easy to review

The main wow feature is **Pokemon Team Lab**.

````
