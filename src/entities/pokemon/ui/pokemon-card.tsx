import { Link } from "react-router-dom"
import { Card, CardContent } from "@/shared/ui"
import { getPokemonArtwork } from "@/entities/pokemon/lib/artwork"
import { getTypeColor } from "@/entities/pokemon/lib/type-colors"
import type { PokemonDetail } from "@/entities/pokemon/model/types"
import { formatPokemonId, formatPokemonName } from "@/shared/lib/format"
import { PokemonTypeBadge } from "./pokemon-type-badge"
import type { ReactNode } from "react"

type PokemonCardProps = {
  pokemon: PokemonDetail
  action?: ReactNode
}

export function PokemonCard({ pokemon, action }: PokemonCardProps) {
  const primaryType = pokemon.types[0]?.type.name ?? "normal"
  const primaryColor = getTypeColor(primaryType)
  const artwork = getPokemonArtwork(pokemon)

  return (
    <Card
      data-testid="pokemon-card"
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card py-0 text-left shadow-xl shadow-slate-950/10 transition-transform duration-200 active:scale-[0.98] md:hover:-translate-y-1 md:hover:border-foreground/20 md:hover:bg-muted/40 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-slate-950/20 dark:md:hover:border-white/20 dark:md:hover:bg-white/[0.07]"
      style={{
        boxShadow: `0 20px 50px -30px ${primaryColor}`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: primaryColor }}
      />
      <Link
        to={`/pokemon/${pokemon.name}`}
        className="flex min-w-0 flex-1 flex-col focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pokemon-yellow/50"
        aria-label={`Open ${formatPokemonName(pokemon.name)} detail page`}
      >
        <CardContent className="flex min-h-72 flex-1 flex-col gap-4 p-3 sm:min-h-80 sm:p-4">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                {formatPokemonId(pokemon.id)}
              </p>
              <h2
                data-testid="pokemon-card-name"
                className="mt-1 min-h-[3rem] break-words text-lg font-black leading-tight tracking-normal whitespace-normal text-pokemon-dark line-clamp-2 sm:text-xl dark:text-white"
              >
                {formatPokemonName(pokemon.name)}
              </h2>
            </div>
            <div
              className="max-w-full shrink-0 rounded-full border px-2 py-1 text-[0.65rem] font-bold break-words whitespace-normal uppercase sm:text-xs"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              {primaryType}
            </div>
          </div>

          <div className="relative flex h-36 shrink-0 items-center justify-center rounded-lg bg-muted/60 sm:h-40 dark:bg-slate-950/40">
            <div
              className="absolute inset-8 rounded-full blur-3xl transition-transform duration-200 md:group-hover:scale-110"
              style={{ backgroundColor: `${primaryColor}55` }}
            />
            {artwork ? (
              <img
                src={artwork}
                alt={formatPokemonName(pokemon.name)}
                className="relative z-10 h-32 w-32 object-contain drop-shadow-2xl transition-transform duration-200 sm:h-36 sm:w-36 md:group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="relative z-10 text-sm text-muted-foreground dark:text-slate-400">
                Artwork unavailable
              </div>
            )}
          </div>

          <div className="mt-auto flex min-w-0 flex-wrap gap-2">
            {pokemon.types.map(({ type }) => (
              <PokemonTypeBadge key={type.name} typeName={type.name} />
            ))}
          </div>
        </CardContent>
      </Link>
      {action ? <div className="mt-auto px-4 pb-4">{action}</div> : null}
    </Card>
  )
}
