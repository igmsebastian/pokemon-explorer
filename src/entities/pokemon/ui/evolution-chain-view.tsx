import { Link } from "react-router-dom"
import type {
  EvolutionChain,
  EvolutionChainLink,
} from "@/entities/pokemon/model/types"
import { getTypeColor } from "@/entities/pokemon/lib/type-colors"
import { formatPokemonName } from "@/shared/lib/format"
import { ChevronDown, ChevronRight } from "lucide-react"

type EvolutionChainViewProps = {
  evolutionChain: EvolutionChain | undefined
  currentPokemonName?: string
  accentType?: string
}

export function EvolutionChainView({
  evolutionChain,
  currentPokemonName,
  accentType = "normal",
}: EvolutionChainViewProps) {
  const stages = evolutionChain ? flattenEvolutionChain(evolutionChain.chain) : []
  const accentColor = getTypeColor(accentType)

  if (stages.length === 0) {
    return (
      <div
        data-testid="pokemon-evolution-section"
        className="rounded-lg border border-border bg-muted/60 p-5 text-sm text-muted-foreground dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-400"
      >
        Evolution data is still being researched.
      </div>
    )
  }

  return (
    <div
      data-testid="pokemon-evolution-section"
      className="grid gap-3 sm:flex sm:flex-wrap sm:items-center"
    >
      {stages.map((stage, index) => (
        <div
          key={`${stage.name}-${index}`}
          className="grid gap-3 sm:flex sm:items-center"
        >
          {index > 0 ? (
            <>
              <ChevronDown className="mx-auto size-5 text-muted-foreground sm:hidden dark:text-slate-500" />
              <ChevronRight className="hidden size-5 text-muted-foreground sm:block dark:text-slate-500" />
            </>
          ) : null}
          <Link
            to={`/pokemon/${stage.name}`}
            data-testid={
              stage.name === currentPokemonName
                ? "pokemon-evolution-current"
                : undefined
            }
            className={[
              "flex min-h-11 w-full max-w-full items-center justify-center rounded-lg border px-4 py-3 text-center font-semibold break-words whitespace-normal transition sm:w-auto sm:min-w-32",
              stage.name === currentPokemonName
                ? "text-foreground dark:text-white"
                : "border-border bg-card text-foreground hover:border-pokemon-yellow/60 hover:text-pokemon-blue dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:text-pokemon-yellow",
            ].join(" ")}
            style={
              stage.name === currentPokemonName
                ? {
                    backgroundColor: `${accentColor}22`,
                    borderColor: accentColor,
                    boxShadow: `0 0 24px -10px ${accentColor}`,
                  }
                : undefined
            }
          >
            {formatPokemonName(stage.name)}
          </Link>
        </div>
      ))}
    </div>
  )
}

function flattenEvolutionChain(link: EvolutionChainLink): Array<{ name: string }> {
  const nextStage = link.evolves_to[0]

  if (!nextStage) {
    return [{ name: link.species.name }]
  }

  return [{ name: link.species.name }, ...flattenEvolutionChain(nextStage)]
}
