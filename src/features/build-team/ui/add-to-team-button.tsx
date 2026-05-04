import { Plus } from "lucide-react"
import { Badge, Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui"
import type { PokemonDetail } from "@/entities/pokemon/model/types"
import {
  createTeamPokemon,
  MAX_TEAM_SIZE,
  useTeamStore,
} from "@/features/build-team/model/team-store"

type AddToTeamButtonProps = {
  pokemon: PokemonDetail
  compact?: boolean
}

export function AddToTeamButton({ pokemon, compact = false }: AddToTeamButtonProps) {
  const team = useTeamStore((state) => state.team)
  const addPokemon = useTeamStore((state) => state.addPokemon)
  const partyCount = useTeamStore((state) =>
    state.getPokemonPartyCount(pokemon.name),
  )
  const isTeamFull = team.length >= MAX_TEAM_SIZE
  const label = isTeamFull ? "Party Full" : "Add"

  const button = (
    <div className="grid gap-2">
      {partyCount > 0 ? (
        <Badge
          variant="outline"
          className="justify-center border-border bg-muted text-muted-foreground dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
        >
          In Party x{partyCount}
        </Badge>
      ) : null}
      <Button
        type="button"
        data-testid="add-to-team-button"
        className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:border disabled:border-border disabled:bg-muted disabled:text-muted-foreground dark:bg-pokemon-yellow dark:text-slate-950 dark:hover:bg-pokemon-yellow/90 dark:disabled:bg-slate-700 dark:disabled:text-slate-300"
        disabled={isTeamFull}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          addPokemon(createTeamPokemon(pokemon))
        }}
      >
        <Plus className="size-4" />
        {compact ? label : label}
      </Button>
    </div>
  )

  if (!isTeamFull) {
    return button
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        Team Lab accepts {MAX_TEAM_SIZE} Pokemon
      </TooltipContent>
    </Tooltip>
  )
}
