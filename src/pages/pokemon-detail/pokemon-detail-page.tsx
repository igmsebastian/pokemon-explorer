import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  Activity,
  ArrowLeft,
  BadgeInfo,
  Dumbbell,
  Loader2,
  Ruler,
  Sparkles,
  Weight,
} from "lucide-react"
import {
  useEvolutionChain,
  usePokemonDetail,
  usePokemonSpecies,
} from "@/entities/pokemon/api/hooks"
import { getPokemonArtwork } from "@/entities/pokemon/lib/artwork"
import { getTypeColor } from "@/entities/pokemon/lib/type-colors"
import { EvolutionChainView } from "@/entities/pokemon/ui/evolution-chain-view"
import { PokemonStatBars } from "@/entities/pokemon/ui/pokemon-stat-bars"
import { PokemonTypeBadge } from "@/entities/pokemon/ui/pokemon-type-badge"
import { AddToTeamButton } from "@/features/build-team/ui/add-to-team-button"
import { useActivePokemonStore } from "@/features/active-pokemon/model/active-pokemon-store"
import { formatPokemonId, formatPokemonName } from "@/shared/lib/format"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/shared/ui"

const DETAIL_DESKTOP_QUERY = "(min-width: 768px)"

export function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const pokemonName = name ?? ""
  const detailQuery = usePokemonDetail(pokemonName)
  const speciesQuery = usePokemonSpecies(pokemonName)
  const setActivePokemon = useActivePokemonStore(
    (state) => state.setActivePokemon,
  )
  const isDesktopLayout = useIsDesktopDetailLayout()
  const evolutionQuery = useEvolutionChain(
    speciesQuery.data?.evolution_chain?.url,
  )

  useEffect(() => {
    if (!detailQuery.data) {
      return
    }

    setActivePokemon({
      name: detailQuery.data.name,
      image: getPokemonArtwork(detailQuery.data),
    })
  }, [detailQuery.data, setActivePokemon])

  if (detailQuery.isLoading) {
    return <PokemonDetailSkeleton />
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-12 text-center">
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-8">
          <h1 className="text-3xl font-black text-pokemon-dark dark:text-white">
            Pokemon not found
          </h1>
          <p className="mt-2 text-red-700/80 dark:text-red-100/80">
            The lab could not retrieve this PokeAPI profile.
          </p>
          <Button asChild className="mt-5 bg-primary text-primary-foreground dark:bg-pokemon-yellow dark:text-slate-950">
            <Link to="/">Return to explorer</Link>
          </Button>
        </div>
      </section>
    )
  }

  const pokemon = detailQuery.data
  const primaryType = pokemon.types[0]?.type.name ?? "normal"
  const accentColor = getTypeColor(primaryType)
  const artwork = getPokemonArtwork(pokemon)
  const genus = speciesQuery.data?.genera.find(
    (entry) => entry.language.name === "en",
  )?.genus
  const flavorText = speciesQuery.data?.flavor_text_entries
    .find((entry) => entry.language.name === "en")
    ?.flavor_text.replace(/\f/g, " ")
    .replace(/\s+/g, " ")
  const topMoves = pokemon.moves.slice(0, 8)
  const handleBackToExplorer = () => {
    const historyIndex = window.history.state?.idx

    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1)
      return
    }

    navigate("/")
  }

  return (
    <section
      data-testid="pokemon-detail-page"
      className="mx-auto grid max-w-7xl gap-5 px-4 pt-4 pb-28 sm:px-6 md:gap-6 md:py-8 lg:px-8"
    >
      <Button
        type="button"
        variant="ghost"
        data-testid="back-to-explorer"
        aria-label="Back to Explorer"
        className="w-fit text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        onClick={handleBackToExplorer}
      >
        <ArrowLeft className="size-4" />
        Back to explorer
      </Button>

      <div
        className="grid gap-5 rounded-lg border border-border bg-card p-4 shadow-xl shadow-slate-950/5 sm:p-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6 lg:p-8 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-slate-950/20"
        style={{ boxShadow: `0 30px 80px -55px ${accentColor}` }}
      >
        <div className="grid gap-4 sm:gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-white text-slate-950">
              {formatPokemonId(pokemon.id)}
            </Badge>
            {pokemon.types.map(({ type }) => (
              <PokemonTypeBadge key={type.name} typeName={type.name} />
            ))}
          </div>
          <div>
            <h1
              data-testid="pokemon-detail-title"
              className="break-words text-4xl font-black leading-tight tracking-normal text-pokemon-dark sm:text-5xl md:text-7xl dark:text-white"
            >
              {formatPokemonName(pokemon.name)}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground dark:text-slate-300">
              {genus ?? "Pokemon field profile"}
            </p>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground dark:text-slate-300">
            {flavorText ??
              "Core combat data is available. Species notes are still syncing from PokeAPI."}
          </p>
          <div className="sm:max-w-xs">
            <AddToTeamButton pokemon={pokemon} />
          </div>
        </div>

        <div className="relative min-h-64 overflow-hidden rounded-lg bg-muted/60 sm:min-h-80 dark:bg-slate-950/50">
          <div
            className="absolute inset-16 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}66` }}
          />
          {artwork ? (
            <img
              src={artwork}
              alt={`${formatPokemonName(pokemon.name)} artwork`}
              className="relative z-10 mx-auto h-64 w-full object-contain p-4 drop-shadow-2xl sm:h-80 sm:p-6"
            />
          ) : (
            <div className="relative z-10 grid h-full place-items-center text-muted-foreground dark:text-slate-400">
              Artwork unavailable
            </div>
          )}
        </div>
      </div>

      <PokemonMetrics pokemon={pokemon} />

      {isDesktopLayout ? (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <StatsCard pokemon={pokemon} primaryType={primaryType} />
            <EvolutionCard
              currentPokemonName={pokemon.name}
              accentType={primaryType}
              evolutionQuery={evolutionQuery}
            />
          </div>

          <aside className="grid gap-6 self-start">
            <AbilitiesCard pokemon={pokemon} />
            <MovesCard topMoves={topMoves} />
          </aside>
        </div>
      ) : (
        <PokemonDetailMobileAccordion
          pokemon={pokemon}
          primaryType={primaryType}
          evolutionQuery={evolutionQuery}
          topMoves={topMoves}
        />
      )}
    </section>
  )
}

type EvolutionQuery = ReturnType<typeof useEvolutionChain>

function PokemonDetailMobileAccordion({
  pokemon,
  primaryType,
  evolutionQuery,
  topMoves,
}: {
  pokemon: DetailPokemon
  primaryType: string
  evolutionQuery: EvolutionQuery
  topMoves: DetailPokemon["moves"]
}) {
  return (
    <Accordion
      type="single"
      defaultValue="stats"
      collapsible
      className="grid gap-3"
    >
      <DetailAccordionItem
        value="stats"
        title="Base Stats"
        icon={<Activity className="size-5 text-primary dark:text-pokemon-yellow" />}
      >
        <PokemonStatBars stats={pokemon.stats} accentType={primaryType} />
      </DetailAccordionItem>
      <DetailAccordionItem
        value="abilities"
        title="Abilities"
        icon={<BadgeInfo className="size-5 text-primary dark:text-pokemon-yellow" />}
      >
        <AbilitiesList pokemon={pokemon} />
      </DetailAccordionItem>
      <DetailAccordionItem
        value="moves"
        title="Top Moves"
        icon={<Dumbbell className="size-5 text-primary dark:text-pokemon-yellow" />}
      >
        <MovesList topMoves={topMoves} />
      </DetailAccordionItem>
      <DetailAccordionItem
        value="evolution"
        title="Evolution Chain"
        icon={<Sparkles className="size-5 text-primary dark:text-pokemon-yellow" />}
      >
        <EvolutionContent
          currentPokemonName={pokemon.name}
          accentType={primaryType}
          evolutionQuery={evolutionQuery}
        />
      </DetailAccordionItem>
    </Accordion>
  )
}

function DetailAccordionItem({
  value,
  title,
  icon,
  children,
}: {
  value: string
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <AccordionItem
      value={value}
      className="rounded-lg border border-border bg-card px-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
    >
      <AccordionTrigger className="py-4 text-foreground hover:no-underline dark:text-white">
        <span className="flex items-center gap-2 text-left font-black">
          {icon}
          {title}
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-4">{children}</AccordionContent>
    </AccordionItem>
  )
}

type DetailPokemon = NonNullable<ReturnType<typeof usePokemonDetail>["data"]>

function PokemonMetrics({ pokemon }: { pokemon: DetailPokemon }) {
  const metrics = [
    {
      label: "Height",
      value: `${(pokemon.height / 10).toFixed(1)} m`,
      icon: Ruler,
      testId: "pokemon-metric-height",
    },
    {
      label: "Weight",
      value: `${(pokemon.weight / 10).toFixed(1)} kg`,
      icon: Weight,
      testId: "pokemon-metric-weight",
    },
    {
      label: "Base XP",
      value: pokemon.base_experience?.toString() ?? "Unknown",
      icon: Sparkles,
      testId: "pokemon-metric-base-xp",
    },
  ]

  return (
    <div
      data-testid="pokemon-metrics"
      className="grid grid-cols-3 gap-2 sm:gap-3 [&>*]:min-w-0"
    >
      {metrics.map((item) => (
        <Card
          key={item.label}
          data-testid={item.testId}
          className="rounded-lg border-border bg-card shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
        >
          <CardContent className="grid min-h-24 gap-2 p-3 sm:min-h-28 sm:p-4">
            <div className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground sm:text-sm dark:text-slate-400">
              <item.icon className="size-4 shrink-0 text-primary dark:text-pokemon-yellow" />
              <span className="min-w-0 break-words leading-tight">
                {item.label}
              </span>
            </div>
            <p className="break-words text-lg font-black leading-tight text-foreground sm:text-2xl dark:text-white">
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatsCard({
  pokemon,
  primaryType,
}: {
  pokemon: DetailPokemon
  primaryType: string
}) {
  return (
    <Card className="rounded-lg border-border bg-card dark:border-white/10 dark:bg-white/[0.04]">
      <CardHeader>
        <CardTitle
          role="heading"
          aria-level={2}
          className="flex items-center gap-2 text-foreground dark:text-white"
        >
          <Activity className="size-5 text-primary dark:text-pokemon-yellow" />
          Base Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PokemonStatBars stats={pokemon.stats} accentType={primaryType} />
      </CardContent>
    </Card>
  )
}

function AbilitiesCard({ pokemon }: { pokemon: DetailPokemon }) {
  return (
    <Card className="rounded-lg border-border bg-card dark:border-white/10 dark:bg-white/[0.04]">
      <CardHeader>
        <CardTitle
          role="heading"
          aria-level={2}
          className="flex items-center gap-2 text-foreground dark:text-white"
        >
          <BadgeInfo className="size-5 text-primary dark:text-pokemon-yellow" />
          Abilities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AbilitiesList pokemon={pokemon} />
      </CardContent>
    </Card>
  )
}

function AbilitiesList({ pokemon }: { pokemon: DetailPokemon }) {
  return (
    <div data-testid="pokemon-abilities-section" className="grid gap-3">
      {pokemon.abilities.map((ability) => (
        <div
          key={ability.ability.name}
          className="flex min-h-12 min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 dark:border-white/10 dark:bg-slate-950/40"
        >
          <span className="break-words font-semibold text-foreground dark:text-white">
            {formatPokemonName(ability.ability.name)}
          </span>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="border-border text-muted-foreground dark:border-white/20 dark:text-slate-300"
            >
              Ability
            </Badge>
            {ability.is_hidden ? (
              <Badge className="bg-secondary text-secondary-foreground dark:bg-pokemon-yellow dark:text-slate-950">
                Hidden
              </Badge>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

function MovesCard({ topMoves }: { topMoves: DetailPokemon["moves"] }) {
  return (
    <Card className="rounded-lg border-border bg-card dark:border-white/10 dark:bg-white/[0.04]">
      <CardHeader>
        <CardTitle
          role="heading"
          aria-level={2}
          className="flex items-center gap-2 text-foreground dark:text-white"
        >
          <Dumbbell className="size-5 text-primary dark:text-pokemon-yellow" />
          Top Moves
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MovesList topMoves={topMoves} />
      </CardContent>
    </Card>
  )
}

function MovesList({ topMoves }: { topMoves: DetailPokemon["moves"] }) {
  return (
    <div data-testid="pokemon-moves-section" className="grid gap-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
        Known Moves
      </p>
      <div className="flex flex-wrap gap-2">
        {topMoves.map((move) => (
          <Badge
            key={move.move.name}
            variant="outline"
            className="h-auto min-h-7 max-w-full rounded-full border-border bg-muted/60 px-3 py-1 text-sm font-semibold break-words whitespace-normal text-foreground hover:bg-muted dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-white/10"
          >
            {formatPokemonName(move.move.name)}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function EvolutionCard({
  currentPokemonName,
  accentType,
  evolutionQuery,
}: {
  currentPokemonName: string
  accentType: string
  evolutionQuery: EvolutionQuery
}) {
  return (
    <Card className="rounded-lg border-border bg-card dark:border-white/10 dark:bg-white/[0.04]">
      <CardHeader>
        <CardTitle
          role="heading"
          aria-level={2}
          className="flex items-center gap-2 text-foreground dark:text-white"
        >
          <Sparkles className="size-5 text-primary dark:text-pokemon-yellow" />
          Evolution Chain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EvolutionContent
          currentPokemonName={currentPokemonName}
          accentType={accentType}
          evolutionQuery={evolutionQuery}
        />
      </CardContent>
    </Card>
  )
}

function EvolutionContent({
  currentPokemonName,
  accentType,
  evolutionQuery,
}: {
  currentPokemonName: string
  accentType: string
  evolutionQuery: EvolutionQuery
}) {
  return evolutionQuery.isLoading ? (
    <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-slate-400">
      <Loader2 className="size-4 animate-spin" />
      Syncing evolution chain
    </div>
  ) : (
    <EvolutionChainView
      evolutionChain={evolutionQuery.data}
      currentPokemonName={currentPokemonName}
      accentType={accentType}
    />
  )
}

function useIsDesktopDetailLayout() {
  const [isDesktopLayout, setIsDesktopLayout] = useState(() => {
    if (typeof window === "undefined") {
      return true
    }

    return window.matchMedia(DETAIL_DESKTOP_QUERY).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(DETAIL_DESKTOP_QUERY)
    const updateLayout = () => {
      setIsDesktopLayout(mediaQuery.matches)
    }

    updateLayout()
    mediaQuery.addEventListener("change", updateLayout)

    return () => {
      mediaQuery.removeEventListener("change", updateLayout)
    }
  }, [])

  return isDesktopLayout
}

function PokemonDetailSkeleton() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-9 w-36 bg-muted dark:bg-white/10" />
      <div className="grid gap-6 rounded-lg border border-border bg-card p-6 lg:grid-cols-2 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-28 bg-muted dark:bg-white/10" />
          <Skeleton className="h-20 w-80 max-w-full bg-muted dark:bg-white/10" />
          <Skeleton className="h-24 w-full bg-muted dark:bg-white/10" />
          <Skeleton className="h-10 w-full bg-muted dark:bg-white/10" />
        </div>
        <Skeleton className="h-80 rounded-lg bg-muted dark:bg-white/10" />
      </div>
    </section>
  )
}
