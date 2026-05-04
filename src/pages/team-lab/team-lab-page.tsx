import { useEffect, useState } from "react"
import { Beaker, Zap } from "lucide-react"
import { Badge } from "@/shared/ui"
import { PokemonGrid } from "@/widgets/pokemon-grid/pokemon-grid"
import { PokemonSearchPanel } from "@/widgets/pokemon-search-panel/pokemon-search-panel"
import { TeamBuilderPanel } from "@/widgets/team-builder-panel/team-builder-panel"

const TEAM_LAB_SCANNER_QUERY = "(min-width: 768px)"

export function TeamLabPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const shouldRenderScanner = useShouldRenderScanner()

  return (
    <section
      data-testid="team-lab-page"
      className="mx-auto grid max-w-7xl gap-5 px-4 pt-4 pb-28 sm:gap-8 sm:px-6 md:gap-6 md:py-8 lg:px-8"
    >
      <div
        data-testid="team-mobile-summary"
        className="grid gap-2 md:hidden"
      >
        <Badge className="w-fit bg-pokemon-red text-white">
          <Beaker className="size-3" />
          Team Lab
        </Badge>
        <p className="text-base font-semibold leading-6 text-muted-foreground dark:text-slate-300">
          Manage your battle party and review readiness.
        </p>
      </div>

      <div className="hidden gap-5 md:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
        <div>
          <Badge className="bg-pokemon-red text-white">
            <Beaker className="size-3" />
            Team Lab
          </Badge>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-normal text-pokemon-dark sm:text-5xl md:text-7xl dark:text-white">
            Build a six-slot squad with type intelligence.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground dark:text-slate-300">
            Add Pokemon from the scanner, stack favorites if you want, and tune
            your coverage score before battle.
          </p>
        </div>
        <div className="rounded-lg border border-pokemon-blue/30 bg-pokemon-blue/10 p-4 text-sm text-foreground shadow-sm dark:border-pokemon-blue/40 dark:text-blue-50">
          <p className="flex items-center gap-2 font-bold text-foreground dark:text-white">
            <Zap className="size-4 text-primary dark:text-pokemon-yellow" />
            Squad pulse
          </p>
          <p className="mt-2 text-muted-foreground dark:text-slate-200">
            Mix your favorites, watch the lineup settle into shape, and tune a
            party that feels ready for the next route.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
        {shouldRenderScanner ? (
          <div
            data-testid="team-lab-scanner-grid"
            className="hidden min-w-0 gap-5 md:grid"
          >
            <PokemonSearchPanel
              searchTerm={searchTerm}
              selectedType={selectedType}
              onSearchTermChange={setSearchTerm}
              onSelectedTypeChange={setSelectedType}
            />
            <PokemonGrid
              searchTerm={searchTerm}
              selectedType={selectedType}
              showTeamActions
              layout="team-lab"
            />
          </div>
        ) : (
          <div
            data-testid="team-lab-scanner-grid"
            className="hidden"
            aria-hidden="true"
          />
        )}
        <aside
          data-testid="team-analysis-panel"
          className="min-w-0 w-full overflow-x-hidden xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:w-[380px] xl:self-start xl:overflow-y-auto xl:overscroll-contain xl:pr-1 2xl:w-[420px]"
        >
          <TeamBuilderPanel />
        </aside>
      </div>
    </section>
  )
}

function useShouldRenderScanner() {
  const [shouldRenderScanner, setShouldRenderScanner] = useState(() => {
    if (typeof window === "undefined") {
      return true
    }

    return window.matchMedia(TEAM_LAB_SCANNER_QUERY).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(TEAM_LAB_SCANNER_QUERY)
    const updateScannerVisibility = () => {
      setShouldRenderScanner(mediaQuery.matches)
    }

    updateScannerVisibility()
    mediaQuery.addEventListener("change", updateScannerVisibility)

    return () => {
      mediaQuery.removeEventListener("change", updateScannerVisibility)
    }
  }, [])

  return shouldRenderScanner
}
