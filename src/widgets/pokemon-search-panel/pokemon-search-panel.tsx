import { RotateCcw, SlidersHorizontal } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui"
import { PokemonSearchInput } from "@/features/search-pokemon/ui/pokemon-search-input"
import { PokemonTypeFilter } from "@/features/filter-pokemon/ui/pokemon-type-filter"

type PokemonSearchPanelProps = {
  searchTerm: string
  selectedType: string
  onSearchTermChange: (value: string) => void
  onSelectedTypeChange: (value: string) => void
}

export function PokemonSearchPanel({
  searchTerm,
  selectedType,
  onSearchTermChange,
  onSelectedTypeChange,
}: PokemonSearchPanelProps) {
  const hasFilters = searchTerm.trim() !== "" || selectedType !== "all"
  const hasTypeFilter = selectedType !== "all"
  const resetFilters = () => {
    onSearchTermChange("")
    onSelectedTypeChange("all")
  }

  return (
    <Sheet>
      <div
        data-testid="pokemon-search-filter-bar"
        className="sticky top-14 z-40 -mx-4 bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:top-16 sm:px-6 md:top-16 md:mx-0 md:rounded-2xl md:border md:border-border md:bg-card/95 md:p-3 md:text-card-foreground md:shadow-sm dark:bg-slate-950/90 md:dark:border-white/10 md:dark:bg-slate-950/85"
      >
        <div data-testid="mobile-search-filter-bar">
          <Card className="rounded-lg border-border bg-card/80 py-0 shadow-sm md:border-0 md:bg-transparent md:shadow-none md:ring-0 dark:border-white/10 dark:bg-white/[0.04] md:dark:border-transparent md:dark:bg-transparent">
            <CardContent className="flex items-center gap-2 p-3 sm:p-4 md:p-0">
              <div className="min-w-0 flex-1">
                <PokemonSearchInput
                  value={searchTerm}
                  onChange={onSearchTermChange}
                />
              </div>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  data-testid="mobile-filter-button"
                  aria-label="Open Pokemon filters"
                  className="relative h-12 w-12 shrink-0 rounded-xl border border-border bg-card p-0 text-foreground shadow-sm transition hover:bg-muted active:scale-95 md:hidden dark:border-white/10 dark:bg-slate-900/90 dark:text-white dark:hover:bg-slate-800"
                >
                  <SlidersHorizontal className="size-5" />
                  {hasTypeFilter ? (
                    <span className="absolute right-2 top-2 size-2 rounded-full bg-pokemon-yellow" />
                  ) : null}
                </Button>
              </SheetTrigger>
              <div className="hidden gap-3 md:flex md:items-center">
                <PokemonTypeFilter
                  value={selectedType}
                  onChange={onSelectedTypeChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-border bg-card/70 text-foreground hover:bg-muted active:scale-[0.98] dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:hover:bg-white/10"
                  disabled={!hasFilters}
                  onClick={resetFilters}
                >
                  <RotateCcw className="size-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <SheetContent
        side="bottom"
        data-testid="mobile-filter-sheet"
        className="rounded-t-lg border-border bg-popover text-popover-foreground md:hidden dark:border-white/10 dark:bg-slate-950 dark:text-white"
      >
        <SheetHeader>
          <SheetTitle>Pokemon Filters</SheetTitle>
          <SheetDescription className="text-muted-foreground dark:text-slate-400">
            {hasTypeFilter
              ? `Current type: ${selectedType}`
              : "Narrow the scanner by Pokemon type."}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-4">
          <PokemonTypeFilter
            value={selectedType}
            onChange={onSelectedTypeChange}
            className="w-full"
          />
          <Button
            type="button"
            variant="outline"
            data-testid="pokemon-filter-reset"
            className="h-11 w-full border-border bg-card/70 text-foreground hover:bg-muted active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10"
            disabled={!hasFilters}
            onClick={resetFilters}
          >
            <RotateCcw className="size-4" />
            Reset filters
          </Button>
          <SheetClose asChild>
              <Button
                type="button"
                data-testid="pokemon-filter-apply"
                className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] dark:bg-pokemon-yellow dark:text-slate-950 dark:hover:bg-pokemon-yellow/90"
              >
                Apply filters
              </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
