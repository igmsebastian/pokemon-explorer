import { Search } from "lucide-react"
import { Input } from "@/shared/ui"

type PokemonSearchInputProps = {
  value: string
  onChange: (value: string) => void
}

export function PokemonSearchInput({
  value,
  onChange,
}: PokemonSearchInputProps) {
  return (
    <label className="relative block">
      <span className="sr-only">Search Pokemon by name</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground dark:text-slate-400" />
      <Input
        data-testid="pokemon-search-input"
        aria-label="Search Pokemon by name"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search Pokemon"
        className="h-11 rounded-lg border-border bg-background/70 pl-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-pokemon-yellow/40 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500"
      />
    </label>
  )
}
