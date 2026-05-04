import { Search } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useActivePokemonStore } from "@/features/active-pokemon/model/active-pokemon-store"
import { MAX_TEAM_SIZE, useTeamStore } from "@/features/build-team/model/team-store"
import { formatPokemonName } from "@/shared/lib/format"

const KANTO_POKEMON_COUNT = 151

export function MobileBottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const teamCount = useTeamStore((state) => state.team.length)
  const activePokemonName = useActivePokemonStore(
    (state) => state.activePokemonName,
  )
  const activePokemonImage = useActivePokemonStore(
    (state) => state.activePokemonImage,
  )
  const isExploreActive = location.pathname === "/"
  const isTeamActive = location.pathname === "/team-lab"
  const isPokemonActive = location.pathname.startsWith("/pokemon/")

  return (
    <nav
      data-testid="mobile-bottom-nav"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pt-2 shadow-2xl shadow-slate-950/10 backdrop-blur-xl pb-[calc(env(safe-area-inset-bottom)+0.5rem)] dark:border-white/10 dark:bg-slate-950/95 dark:shadow-slate-950/80 md:hidden"
      aria-label="Mobile primary"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 items-end gap-1 px-3">
        <Link
          to="/"
          data-testid="mobile-nav-explore"
          aria-label="Go to Explore"
          aria-current={isExploreActive ? "page" : undefined}
          className={[
            "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-bold transition active:scale-95",
            isExploreActive
              ? "text-primary dark:text-pokemon-yellow"
              : "text-muted-foreground hover:text-foreground dark:text-slate-300 dark:hover:text-white",
          ].join(" ")}
        >
          <Search className="size-5" />
          Explore
        </Link>

        {activePokemonName ? (
          <Link
            to={`/pokemon/${activePokemonName}`}
            data-testid="mobile-nav-active-pokemon"
            aria-label="Open active Pokemon"
            aria-current={isPokemonActive ? "page" : undefined}
            className={[
              "relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-2 text-xs font-black transition active:scale-95",
              isPokemonActive
                ? "text-primary dark:text-pokemon-yellow"
                : "text-foreground dark:text-slate-100",
            ].join(" ")}
          >
            <span
              className={[
                "grid size-14 place-items-center rounded-full border bg-card shadow-lg transition dark:bg-slate-900",
                isPokemonActive
                  ? "border-primary shadow-primary/20 dark:border-pokemon-yellow dark:shadow-pokemon-yellow/20"
                  : "border-border shadow-slate-950/10 dark:border-white/15 dark:shadow-slate-950/60",
              ].join(" ")}
            >
              {activePokemonImage ? (
                <img
                  src={activePokemonImage}
                  alt=""
                  className="size-12 object-contain"
                />
              ) : (
                <img src="/pokeball.svg" alt="" className="size-8" />
              )}
            </span>
            <span className="max-w-[6rem] break-words text-center leading-tight whitespace-normal line-clamp-2">
              {formatPokemonName(activePokemonName)}
            </span>
          </Link>
        ) : (
          <button
            type="button"
            data-testid="mobile-nav-mystery-pokemon"
            aria-label="Open mystery Pokemon"
            title="Who's that Pokemon?"
            className="relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-2 text-xs font-black text-foreground transition active:scale-95 dark:text-slate-100"
            onClick={() => {
              const randomPokemonId =
                Math.floor(Math.random() * KANTO_POKEMON_COUNT) + 1
              navigate(`/pokemon/${randomPokemonId}`)
            }}
          >
            <span className="grid size-14 place-items-center rounded-full border border-primary/60 bg-card shadow-lg shadow-primary/15 dark:border-pokemon-yellow/60 dark:bg-slate-900 dark:shadow-pokemon-yellow/15">
              <img
                src="/mystery.png"
                alt=""
                data-testid="mystery-pokemon-icon"
                className="size-12 object-contain"
              />
            </span>
            Mystery
          </button>
        )}

        <Link
          to="/team-lab"
          data-testid="mobile-nav-team"
          aria-label="Go to My Team"
          aria-current={isTeamActive ? "page" : undefined}
          className={[
            "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-bold transition active:scale-95",
            isTeamActive
              ? "text-primary dark:text-pokemon-yellow"
              : "text-muted-foreground hover:text-foreground dark:text-slate-300 dark:hover:text-white",
          ].join(" ")}
        >
          <span className="relative">
            <img
              src="/pokeball.svg"
              alt=""
              data-testid="pokeball-icon"
              className="h-5 w-5 object-contain"
            />
            {teamCount > 0 ? (
              <span
                data-testid="mobile-nav-team-count"
                className="absolute -right-5 -top-2 rounded-full bg-pokemon-yellow px-1.5 py-0.5 text-[0.6rem] font-black leading-none text-slate-950"
              >
                {teamCount}/{MAX_TEAM_SIZE}
              </span>
            ) : null}
          </span>
          My Team
        </Link>
      </div>
    </nav>
  )
}
