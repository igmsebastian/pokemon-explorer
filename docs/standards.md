# Engineering Standards

## Feature-Sliced Design Standards

Pokemon Explorer uses a practical Feature-Sliced Design structure for a React
single-page app.

Rules:

- Pages compose widgets, features, and entities. They do not own business logic.
- Widgets combine features and entities into larger UI blocks.
- Features own user actions and feature-specific state transitions.
- Entities own Pokemon domain logic, Pokemon API hooks, Pokemon model types, and
  Pokemon-specific UI.
- Shared contains reusable utilities, UI exports, config, and API helpers only.

Keep changes close to the layer that owns the behavior. Do not move logic into a
higher layer just because it is convenient.

## Naming Standards

- Use kebab-case for folders and file names where practical.
- Use PascalCase for React components.
- Use camelCase for variables and functions.
- Use descriptive variable names.
- Avoid single-letter variable names except for tiny local callbacks where the
  meaning is obvious.
- Query hooks start with `use`.
- Zustand stores use `useXStore`.
- Test IDs should describe the UI role or feature.

Examples:

```ts
usePokemonDetail()
useTeamStore()
PokemonCard
pokemonQueryKeys
```

## Component Standards

- Keep components small and focused.
- Avoid large JSX blobs.
- Do not call APIs directly inside presentational components.
- Use composition instead of deep prop chains where possible.
- Use shadcn/ui where appropriate for accessible primitives.
- Put reusable UI in `shared/ui`.
- Put Pokemon-specific UI in `entities/pokemon/ui`.

Components should handle loading, error, and empty states when they render
data-fetching output. A failed request should never leave a blank page.

## API and Query Standards

- Use Fetch API only.
- Use TanStack Query for server data.
- Use stable query keys.
- Every data-fetching UI needs loading, error, and empty states.
- Use `enabled` for dependent queries.
- Do not invalidate queries without a clear reason.
- Do not fetch all Pokemon details at once.
- Use `Promise.all` only for small, controlled batches.

Default caching strategy:

```ts
staleTime: 1000 * 60 * 5
gcTime: 1000 * 60 * 30
refetchOnWindowFocus: false
retry: 2
```

These defaults are configurable through env values and centralized in the shared
app config.

## Error Handling Standards

- API errors should show user-friendly UI.
- Avoid blank screens.
- Use explicit error states.
- Use empty states when filters or searches return no data.
- Avoid console spam.
- Gracefully handle missing Pokemon data or unavailable artwork.
- Keep fallback text short and actionable.

## Theme and Color Standards

Dark mode is the default premium experience. The app supports dark, light, and
system modes. Theme selection persists locally and the active dark theme applies
the document root `dark` class.

Pokemon palette:

```ts
red: "#FF0000"
yellow: "#FFCB05"
blue: "#3B4CCA"
white: "#FFFFFF"
dark: "#1F2937"
```

Theme direction:

- Dark mode uses yellow as the main accent.
- Light mode uses red and blue as the main accents.
- Yellow in light mode should be a small highlight only.
- Pokemon type colors remain consistent across both themes.

Prefer theme-aware tokens:

```tsx
bg-background
text-foreground
bg-card
text-card-foreground
border-border
text-muted-foreground
```

Avoid unguarded dark-only classes:

```tsx
text-white
bg-slate-950
border-white/10
```

Use `dark:` variants when a dark-only treatment is intentional.

## Responsive Standards

- Design mobile-first.
- Support iPhone X minimum width.
- Support modern mobile phones, tablets, and desktop.
- Maintain Safari and Chrome compatibility.
- Use the mobile bottom navigation as the primary mobile navigation.
- Avoid horizontal overflow.
- Use `min-h-dvh` where useful for mobile viewport behavior.
- Respect safe-area spacing for fixed mobile UI.
- Do not rely on hover for important mobile interactions.

## Playwright Testing Standards

Tests live in `tests/` and should exercise real user flows through the UI.

Major flows to cover:

- Explore
- Pokemon detail
- Team Lab
- Theme switching
- Mobile navigation
- Responsive behavior

Prefer:

- `getByRole`
- `getByTestId`
- `expect(locator).toBeVisible()`

Avoid fixed waits. Use stable selectors and UI assertions instead.

Useful test IDs:

```tsx
data-testid="pokemon-card"
data-testid="add-to-team-button"
data-testid="team-analysis-panel"
data-testid="theme-switcher"
data-testid="mobile-bottom-nav"
```

Run E2E tests with:

```bash
npm run test:e2e
```

## Quality Gates

Run these before submission:

```bash
npm run lint
npm run build
npm run test:e2e
npm run check
```

At minimum, lint and build must pass before documentation or UI changes are
considered complete.
