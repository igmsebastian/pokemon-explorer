import { Link } from "react-router-dom"
import { RotateCcw, Trash2 } from "lucide-react"
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
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from "@/shared/ui"
import {
  MAX_TEAM_SIZE,
  type TeamPokemon,
  useTeamStore,
} from "@/features/build-team/model/team-store"
import { PokemonTypeBadge } from "@/entities/pokemon/ui/pokemon-type-badge"
import { formatPokemonName } from "@/shared/lib/format"

export function TeamPartyPopover() {
  const team = useTeamStore((state) => state.team)
  const removePokemon = useTeamStore((state) => state.removePokemon)
  const clearTeam = useTeamStore((state) => state.clearTeam)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-testid="team-count-trigger"
          aria-label="View current battle party"
          className="hidden h-9 gap-2 rounded-full border-border bg-card/80 px-3 text-sm text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white md:inline-flex"
        >
          <img
            src="/pokeball.svg"
            alt=""
            data-testid="pokeball-icon"
            className="h-4 w-4 object-contain"
          />
          <span data-testid="header-team-count">
            {team.length} / {MAX_TEAM_SIZE}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        data-testid="team-party-popover"
        className="w-[320px] max-w-[calc(100vw-2rem)] gap-3 border-border bg-popover p-3 text-popover-foreground shadow-2xl dark:border-white/10 dark:bg-slate-950/95"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-foreground dark:text-white">
              My Battle Party
            </h2>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              {team.length} of {MAX_TEAM_SIZE} slots filled
            </p>
          </div>
          <Badge className="bg-pokemon-blue text-white">
            {team.length}/{MAX_TEAM_SIZE}
          </Badge>
        </div>

        {team.length === 0 ? (
          <div
            data-testid="team-party-empty"
            className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground dark:border-white/15 dark:text-slate-400"
          >
            <p className="font-semibold text-foreground dark:text-white">
              No Pokemon in your party yet.
            </p>
            <p className="mt-2">
              Add Pokemon from the Explorer to build your team.
            </p>
          </div>
        ) : (
          <div className="grid max-h-[420px] gap-2 overflow-y-auto pr-1">
            {team.map((member) => (
              <TeamPartyItem
                key={member.instanceId}
                member={member}
                onRelease={() => removePokemon(member.instanceId)}
              />
            ))}
          </div>
        )}

        <Separator className="bg-border dark:bg-white/10" />

        <div className="grid gap-2">
          <Button asChild className="w-full">
            <Link to="/team-lab">Open Team Lab</Link>
          </Button>
          {team.length > 0 ? (
            <ResetPartyDialog onReset={clearTeam} />
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function TeamPartyItem({
  member,
  onRelease,
}: {
  member: TeamPokemon
  onRelease: () => void
}) {
  return (
    <div
      data-testid="team-party-item"
      className="grid gap-2 rounded-lg border border-border bg-card p-2 dark:border-white/10 dark:bg-white/[0.04]"
    >
      <div className="flex items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-muted dark:bg-slate-900">
          {member.sprite ? (
            <img
              src={member.sprite}
              alt=""
              className="size-10 object-contain"
            />
          ) : (
            <img src="/pokeball.svg" alt="" className="size-7 object-contain" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-black leading-tight whitespace-normal text-foreground dark:text-white">
            {formatPokemonName(member.name)}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {member.types.map((type) => (
              <PokemonTypeBadge key={type} typeName={type} />
            ))}
          </div>
        </div>
      </div>
      <ReleasePokemonDialog member={member} onRelease={onRelease} />
    </div>
  )
}

function ReleasePokemonDialog({
  member,
  onRelease,
}: {
  member: TeamPokemon
  onRelease: () => void
}) {
  const pokemonName = formatPokemonName(member.name)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          data-testid="quick-release-button"
          aria-label={`Release ${pokemonName} from party`}
          className="w-full"
        >
          <Trash2 className="size-3.5" />
          Release
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent data-testid="release-confirm-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Release Pokemon?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove {pokemonName} from your current party.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            data-testid="release-confirm-action"
            onClick={onRelease}
          >
            Release
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function ResetPartyDialog({ onReset }: { onReset: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-testid="reset-party-button"
          className="w-full border-border bg-card text-foreground hover:bg-muted dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10"
        >
          <RotateCcw className="size-4" />
          Reset Party
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent data-testid="reset-party-confirm-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Battle Party?</AlertDialogTitle>
          <AlertDialogDescription>
            This will release all Pokemon from your current party.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Party</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            data-testid="reset-party-confirm-action"
            onClick={onReset}
          >
            Reset Party
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
