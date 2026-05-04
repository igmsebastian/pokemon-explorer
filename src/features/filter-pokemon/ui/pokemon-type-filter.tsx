import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui"
import { usePokemonTypes } from "@/entities/pokemon/api/hooks"
import { formatPokemonName } from "@/shared/lib/format"
import { cn } from "@/lib/utils"

type PokemonTypeFilterProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function PokemonTypeFilter({
  value,
  onChange,
  className,
}: PokemonTypeFilterProps) {
  const { data, isError, isLoading } = usePokemonTypes()
  const typeOptions = data?.results ?? []

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        data-testid="pokemon-type-filter"
        aria-label="Filter Pokemon by type"
        className={cn(
          "h-11 w-full rounded-lg border-border bg-background/70 text-foreground focus:ring-pokemon-yellow/40 sm:w-52 dark:border-white/10 dark:bg-slate-950/60 dark:text-white",
          className,
        )}
      >
        <SelectValue placeholder="Filter type" />
      </SelectTrigger>
      <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)]">
        <SelectItem value="all">All types</SelectItem>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Loading types
          </SelectItem>
        ) : null}
        {isError ? (
          <SelectItem value="error" disabled>
            Type scan unavailable
          </SelectItem>
        ) : null}
        {!isLoading && !isError && typeOptions.length === 0 ? (
          <SelectItem value="empty" disabled>
            No types available
          </SelectItem>
        ) : null}
        {typeOptions.map((typeResource) => (
          <SelectItem key={typeResource.name} value={typeResource.name}>
            {formatPokemonName(typeResource.name)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
