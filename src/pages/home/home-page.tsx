import { useEffect, useRef } from "react"
import { Badge } from "@/shared/ui"
import { useExploreStateStore } from "@/features/search-pokemon/model/explore-state-store"
import { PokemonGrid } from "@/widgets/pokemon-grid/pokemon-grid"
import { PokemonSearchPanel } from "@/widgets/pokemon-search-panel/pokemon-search-panel"

export function HomePage() {
  const searchTerm = useExploreStateStore((state) => state.searchTerm)
  const selectedType = useExploreStateStore((state) => state.selectedType)
  const savedScrollY = useExploreStateStore((state) => state.scrollY)
  const setSearchTerm = useExploreStateStore((state) => state.setSearchTerm)
  const setSelectedType = useExploreStateStore((state) => state.setSelectedType)
  const setScrollY = useExploreStateStore((state) => state.setScrollY)
  const hasRestoredScroll = useRef(false)

  useEffect(() => {
    if (hasRestoredScroll.current || savedScrollY <= 0) {
      return
    }

    hasRestoredScroll.current = true
    const restoreDelays = [0, 100, 300]
    const timeoutIds = restoreDelays.map((delay) =>
      window.setTimeout(() => {
        window.scrollTo(0, savedScrollY)
      }, delay),
    )

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [savedScrollY])

  useEffect(() => {
    return () => {
      setScrollY(window.scrollY)
    }
  }, [setScrollY])

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 pt-6 pb-28 sm:gap-8 sm:px-6 md:py-8 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div>
          <Badge className="bg-pokemon-blue text-white">
            Live PokeAPI research feed
          </Badge>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-normal text-pokemon-dark sm:text-5xl md:text-7xl dark:text-white">
            Pokedex command center for fast team scouting.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground dark:text-slate-300">
            Scan Pokemon, inspect type identity, and send promising candidates
            straight into the Team Lab.
          </p>
        </div>
        <div className="rounded-lg border border-secondary/25 bg-secondary/10 p-4 text-sm text-foreground shadow-sm dark:border-pokemon-yellow/30 dark:bg-pokemon-yellow/10 dark:text-yellow-50">
          <p className="font-bold text-secondary dark:text-pokemon-yellow">
            Lab protocol
          </p>
          <p className="mt-2 text-muted-foreground dark:text-slate-200">
            Cards hydrate through cached detail queries, while the search panel
            uses indexed Pokemon names and type endpoints for quick filtering.
          </p>
        </div>
      </div>

      <PokemonSearchPanel
        searchTerm={searchTerm}
        selectedType={selectedType}
        onSearchTermChange={setSearchTerm}
        onSelectedTypeChange={setSelectedType}
      />

      <PokemonGrid searchTerm={searchTerm} selectedType={selectedType} />
    </section>
  )
}
