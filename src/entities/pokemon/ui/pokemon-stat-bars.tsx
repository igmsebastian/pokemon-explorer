import type { PokemonStat } from "@/entities/pokemon/model/types"
import { getTypeColor } from "@/entities/pokemon/lib/type-colors"
import { formatPokemonName } from "@/shared/lib/format"

type PokemonStatBarsProps = {
  stats: PokemonStat[]
  accentType: string
}

const MAX_STAT_VALUE = 255

export function PokemonStatBars({ stats, accentType }: PokemonStatBarsProps) {
  const accentColor = getTypeColor(accentType)

  return (
    <div className="space-y-4" data-testid="pokemon-stats-section">
      {stats.map((stat) => {
        const percentage = Math.min((stat.base_stat / MAX_STAT_VALUE) * 100, 100)

        return (
          <div key={stat.stat.name} className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-foreground dark:text-slate-200">
                {formatPokemonName(stat.stat.name)}
              </span>
              <span className="tabular-nums text-muted-foreground dark:text-slate-400">
                {stat.base_stat}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted dark:bg-slate-800">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 18px ${accentColor}`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
