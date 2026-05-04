import { useMemo, useState } from "react"
import { AlertTriangle, Database, Loader2 } from "lucide-react"
import { Button } from "@/shared/ui"
import {
  usePokemonCatalog,
  usePokemonList,
  usePokemonNamesByType,
} from "@/entities/pokemon/api/hooks"
import { normalizeSearch } from "@/shared/lib/format"
import { useDebouncedValue } from "@/shared/lib/use-debounced-value"
import { appConfig } from "@/shared/config/env"
import { PokemonCardSkeleton } from "@/entities/pokemon/ui/pokemon-card-skeleton"
import { PokemonGridCard } from "./pokemon-grid-card"

const FILTERED_PAGE_SIZE = appConfig.pokemon.listPageSize
const SEARCH_DEBOUNCE_MS = appConfig.pokemon.searchDebounceMs

type PokemonGridProps = {
  searchTerm: string
  selectedType: string
  showTeamActions?: boolean
  layout?: "explore" | "team-lab"
}

export function PokemonGrid({
  searchTerm,
  selectedType,
  showTeamActions = true,
  layout = "explore",
}: PokemonGridProps) {
  const [filteredPaging, setFilteredPaging] = useState({
    key: "",
    count: FILTERED_PAGE_SIZE,
  })
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS)
  const normalizedSearch = normalizeSearch(debouncedSearchTerm)
  const hasFilters = normalizedSearch !== "" || selectedType !== "all"
  const filterKey = `${normalizedSearch}:${selectedType}`
  const filteredVisibleCount =
    filteredPaging.key === filterKey ? filteredPaging.count : FILTERED_PAGE_SIZE
  const listQuery = usePokemonList()
  const catalogQuery = usePokemonCatalog(hasFilters)
  const typeQuery = usePokemonNamesByType(selectedType)

  const filteredNames = useMemo(() => {
    if (!hasFilters) {
      return []
    }

    const typeSet =
      selectedType === "all" ? null : new Set(typeQuery.data ?? [])

    return (catalogQuery.data?.results ?? [])
      .filter((pokemon) => {
        const matchesSearch =
          normalizedSearch === "" || pokemon.name.includes(normalizedSearch)
        const matchesType = !typeSet || typeSet.has(pokemon.name)

        return matchesSearch && matchesType
      })
      .map((pokemon) => pokemon.name)
  }, [
    catalogQuery.data?.results,
    hasFilters,
    normalizedSearch,
    selectedType,
    typeQuery.data,
  ])

  const visibleNames = hasFilters
    ? filteredNames.slice(0, filteredVisibleCount)
    : listQuery.data?.pages.flatMap((page) => page.results.map((entry) => entry.name)) ??
      []
  const isLoading = hasFilters
    ? catalogQuery.isLoading || (selectedType !== "all" && typeQuery.isLoading)
    : listQuery.isLoading
  const isError = hasFilters
    ? catalogQuery.isError || typeQuery.isError
    : listQuery.isError
  const isFetching = hasFilters
    ? catalogQuery.isFetching || typeQuery.isFetching
    : listQuery.isFetching
  const canLoadMore = hasFilters
    ? filteredVisibleCount < filteredNames.length
    : Boolean(listQuery.hasNextPage)
  const gridClassName =
    layout === "team-lab"
      ? "grid min-w-0 grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      : "grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"

  if (isLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 8 }, (_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-red-700 dark:text-red-100">
        <AlertTriangle className="mb-3 size-6" />
        <h2 className="text-xl font-bold text-foreground dark:text-white">
          Research feed failed
        </h2>
        <p className="mt-2 text-sm text-red-700/80 dark:text-red-100/80">
          PokeAPI did not return the Pokemon index. Try again in a moment.
        </p>
      </div>
    )
  }

  if (visibleNames.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <Database className="mx-auto mb-3 size-8 text-muted-foreground dark:text-slate-400" />
        <h2 className="text-2xl font-black text-foreground dark:text-white">
          No Pokemon found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground dark:text-slate-400">
          Adjust the name scan or type filter to widen the signal.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {isFetching ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-pokemon-blue/40 bg-pokemon-blue/10 px-3 py-1 text-xs font-semibold text-blue-900 dark:text-blue-100">
          <Loader2 className="size-3 animate-spin" />
          Refreshing cached research
        </div>
      ) : null}
      <div className={gridClassName}>
        {visibleNames.map((name) => (
          <PokemonGridCard
            key={name}
            name={name}
            showTeamAction={showTeamActions}
          />
        ))}
      </div>
      {canLoadMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            data-testid="load-more-pokemon"
            className="h-11 border-border bg-card text-foreground hover:bg-muted active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10"
            disabled={listQuery.isFetchingNextPage}
            onClick={() => {
              if (hasFilters) {
                setFilteredPaging({
                  key: filterKey,
                  count: filteredVisibleCount + FILTERED_PAGE_SIZE,
                })
                return
              }

              void listQuery.fetchNextPage()
            }}
          >
            {listQuery.isFetchingNextPage ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            Load more Pokemon
          </Button>
        </div>
      ) : null}
    </div>
  )
}
