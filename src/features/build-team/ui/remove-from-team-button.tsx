import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/shared/ui"
import { useTeamStore } from "@/features/build-team/model/team-store"
import { formatPokemonName } from "@/shared/lib/format"

type RemoveFromTeamButtonProps = {
  instanceId: string
  pokemonName: string
}

export function RemoveFromTeamButton({
  instanceId,
  pokemonName,
}: RemoveFromTeamButtonProps) {
  const removePokemon = useTeamStore((state) => state.removePokemon)
  const formattedPokemonName = formatPokemonName(pokemonName)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="lg"
          data-testid="release-pokemon-button"
          aria-label={`Release ${formattedPokemonName} from party`}
          className="h-10 w-full min-w-0 active:scale-[0.98]"
        >
          <Trash2 className="size-4" />
          Release
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent data-testid="release-confirm-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Release Pokemon?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove {formattedPokemonName} from your current party.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            data-testid="release-confirm-action"
            onClick={() => removePokemon(instanceId)}
          >
            Release
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
