import { AlertTriangle } from "lucide-react"
import { usePokemonDetail } from "@/entities/pokemon/api/hooks"
import { PokemonCard } from "@/entities/pokemon/ui/pokemon-card"
import { PokemonCardSkeleton } from "@/entities/pokemon/ui/pokemon-card-skeleton"
import { AddToTeamButton } from "@/features/build-team/ui/add-to-team-button"
import { formatPokemonName } from "@/shared/lib/format"

type PokemonGridCardProps = {
  name: string
  showTeamAction: boolean
}

export function PokemonGridCard({ name, showTeamAction }: PokemonGridCardProps) {
  const { data, isLoading, isError } = usePokemonDetail(name)

  if (isLoading) {
    return <PokemonCardSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="h-full min-w-0 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-100">
        <AlertTriangle className="mb-2 size-5" />
        Could not load {formatPokemonName(name)}.
      </div>
    )
  }

  return (
    <PokemonCard
      pokemon={data}
      action={showTeamAction ? <AddToTeamButton pokemon={data} compact /> : null}
    />
  )
}
