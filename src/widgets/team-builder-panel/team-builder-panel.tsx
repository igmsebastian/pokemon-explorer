import {
  Activity,
  Gauge,
  Medal,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Swords,
  Target,
  Trophy,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
} from "@/shared/ui"
import { Link } from "react-router-dom"
import {
  MAX_TEAM_SIZE,
  type TeamPokemon,
  useTeamStore,
} from "@/features/build-team/model/team-store"
import {
  getTeamInsights,
  type TeamInsights,
} from "@/features/build-team/model/team-insights"
import { RemoveFromTeamButton } from "@/features/build-team/ui/remove-from-team-button"
import { getTypeColor } from "@/entities/pokemon/lib/type-colors"
import { PokemonTypeBadge } from "@/entities/pokemon/ui/pokemon-type-badge"
import { formatPokemonName } from "@/shared/lib/format"
import type { ReactNode } from "react"

export function TeamBuilderPanel() {
  const team = useTeamStore((state) => state.team)
  const clearTeam = useTeamStore((state) => state.clearTeam)
  const insights = getTeamInsights(team)
  const matchup = getPartyMatchup(team)
  const battlePreview = getBattlePreview(team, insights)

  return (
    <div className="grid min-w-0 max-w-full gap-4 overflow-hidden sm:gap-6">
      <Card className="min-w-0 max-w-full overflow-hidden rounded-lg border-secondary/25 bg-secondary/10 shadow-sm dark:border-pokemon-yellow/30 dark:bg-pokemon-yellow/10">
        <CardHeader className="px-4">
          <CardTitle className="flex min-w-0 flex-wrap items-center justify-between gap-3 text-foreground dark:text-white">
            <span className="flex min-w-0 items-center gap-2 break-words">
              <Trophy className="size-5 text-primary dark:text-pokemon-yellow" />
              Squad Readiness
            </span>
            <span data-testid="team-count" className="text-primary dark:text-pokemon-yellow">
              {team.length} / {MAX_TEAM_SIZE}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 px-4 sm:gap-4">
          <div>
            <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-muted-foreground dark:text-slate-300">
                  Party score
                </p>
                <p
                  data-testid="squad-readiness-score"
                  className="text-3xl font-black text-foreground sm:text-4xl dark:text-white"
                >
                  {insights.score}
                </p>
              </div>
              <Badge
                data-testid="squad-readiness-label"
                className="max-w-full whitespace-normal break-words bg-pokemon-blue text-white"
              >
                {insights.label}
              </Badge>
            </div>
            <Progress
              value={insights.score}
              className="mt-3 h-2 bg-muted dark:bg-slate-800"
            />
          </div>
          <p className="break-words text-sm leading-6 text-muted-foreground dark:text-slate-300">
            {team.length === 0
              ? "Add Pokemon to begin squad analysis."
              : "Score is based on party size, type diversity, coverage, duplicate primary types, and weakness pressure. Duplicate primary types reduce overall balance."}
          </p>
        </CardContent>
      </Card>

      <Card
        data-testid="battle-party"
        className="min-w-0 max-w-full overflow-hidden rounded-lg border-border bg-card shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
      >
        <CardHeader className="px-4">
          <CardTitle className="flex min-w-0 flex-wrap items-center justify-between gap-3 text-foreground dark:text-white">
            <span>Battle Party</span>
            {team.length > 0 ? (
              <Badge
                variant="outline"
                className="max-w-full whitespace-normal break-words border-border text-muted-foreground dark:border-white/10 dark:text-slate-300"
              >
                Custom Lab Cards
              </Badge>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {team.length === 0 ? (
            <div
              data-testid="battle-party-empty"
              className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground dark:border-white/15 dark:text-slate-400"
            >
              <p className="font-semibold text-foreground dark:text-white">
                No Pokemon in your party yet.
              </p>
              <p className="mt-2 hidden md:block">
                Add Pokemon from the scanner to start building your battle
                party.
              </p>
              <p className="mt-2 md:hidden">Go to Explore to add Pokemon.</p>
              <Button
                asChild
                data-testid="explore-pokemon-cta"
                className="mt-4 w-full md:hidden"
              >
                <Link to="/">Explore Pokemon</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {team.map((member) => (
                <PartyMemberCard key={member.instanceId} member={member} />
              ))}
            </div>
          )}

          {team.length > 0 ? (
            <>
              <Separator className="my-4 bg-border dark:bg-white/10" />
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
                      onClick={clearTeam}
                    >
                      Reset Party
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Accordion
        type="multiple"
        defaultValue={[
          "type-effectiveness",
          "party-matchup-snapshot",
          "battle-preview",
        ]}
        className="grid min-w-0 max-w-full gap-3 overflow-hidden"
      >
        <AnalysisSection
          value="type-effectiveness"
          title="Type Effectiveness"
          icon={<Sparkles className="size-5 text-primary dark:text-pokemon-yellow" />}
        >
          <TypeEffectiveness insights={insights} />
        </AnalysisSection>

        {matchup ? (
          <AnalysisSection
            value="party-matchup-snapshot"
            title="Party Matchup Snapshot"
            icon={<Swords className="size-5 text-primary dark:text-pokemon-yellow" />}
          >
            <PartyMatchupSnapshot matchup={matchup} />
          </AnalysisSection>
        ) : null}

        {battlePreview ? (
          <AnalysisSection
            value="battle-preview"
            title="Battle Preview"
            icon={<Activity className="size-5 text-primary dark:text-pokemon-yellow" />}
          >
            <BattlePreview preview={battlePreview} />
          </AnalysisSection>
        ) : null}

        <AnalysisSection
          value="strategy-notes"
          title="Strategy Notes"
          icon={<ShieldAlert className="size-5 text-primary dark:text-pokemon-yellow" />}
        >
          <div
            data-testid="strategy-notes"
            className="grid min-w-0 max-w-full gap-5 overflow-hidden"
          >
            <InsightBlock
              title="Strongest represented types"
              empty="Add Pokemon to reveal strengths."
              items={insights.strongestTypes.map(formatPokemonName)}
            />
            <InsightBlock
              title="Duplicate primary types"
              empty="No duplicate primary types yet."
              items={insights.duplicatePrimaryTypes.map(
                (entry) =>
                  `Multiple ${formatPokemonName(entry.type)}-type leads detected. Consider diversifying your party.`,
              )}
            />
            <InsightBlock
              title="Missing coverage hints"
              empty="Coverage looks broad."
              items={insights.missingCoverageHints.slice(0, 4)}
            />
          </div>
        </AnalysisSection>
      </Accordion>
    </div>
  )
}

function PartyMemberCard({ member }: { member: TeamPokemon }) {
  return (
    <div
      data-testid="battle-party-item"
      className="grid min-w-0 max-w-full gap-3 overflow-hidden rounded-lg border border-border bg-muted/50 p-3 dark:border-white/10 dark:bg-slate-950/50"
      style={{
        boxShadow: `inset 0 0 0 1px ${getTypeColor(member.primaryType)}55`,
      }}
    >
      <div className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-background dark:bg-white/5">
          {member.sprite ? (
            <img
              src={member.sprite}
              alt={formatPokemonName(member.name)}
              className="h-12 w-12 object-contain"
            />
          ) : (
            <Medal className="size-6 text-muted-foreground dark:text-slate-500" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p
              data-testid="battle-party-pokemon-name"
              className="break-words text-sm font-black leading-tight text-foreground dark:text-white"
            >
              {formatPokemonName(member.name)}
            </p>
            <Badge className="max-w-full whitespace-normal break-words bg-pokemon-blue text-[0.62rem] text-white">
              Lab Card
            </Badge>
          </div>
          <p className="mt-1 break-words text-xs text-muted-foreground dark:text-slate-400">
            Stats total {member.statsTotal}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap gap-2">
        {member.types.map((type) => (
          <PokemonTypeBadge
            key={type}
            typeName={type}
            className="max-w-full whitespace-normal break-words"
          />
        ))}
      </div>
      <div className="min-w-0">
        <RemoveFromTeamButton
          instanceId={member.instanceId}
          pokemonName={member.name}
        />
      </div>
    </div>
  )
}

function AnalysisSection({
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
      className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card px-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
    >
      <AccordionTrigger className="min-w-0 gap-3 py-3 text-foreground hover:no-underline dark:text-white">
        <span className="flex min-w-0 flex-wrap items-center gap-2 break-words text-left">
          {icon}
          {title}
        </span>
      </AccordionTrigger>
      <AccordionContent className="min-w-0 max-w-full overflow-hidden pb-4">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

function TypeEffectiveness({ insights }: { insights: TeamInsights }) {
  return (
    <div
      data-testid="type-effectiveness"
      className="grid min-w-0 max-w-full gap-5 overflow-hidden"
    >
      <InsightBlock
        title="Coverage"
        empty="No coverage yet. Add Pokemon to reveal party type coverage."
        items={insights.typeCoverage.map(
          (entry) => `${formatPokemonName(entry.type)} x${entry.count}`,
        )}
      />
      <InsightBlock
        title="Weakness pressure"
        empty="No major weaknesses detected yet."
        items={insights.weaknesses.map(
          (entry) => `${formatPokemonName(entry.type)} x${entry.count}`,
        )}
      />
      <InsightBlock
        title="Missing coverage"
        empty="Coverage looks broad."
        items={insights.missingCoverageHints.slice(0, 4)}
      />
    </div>
  )
}

type Matchup = {
  first: TeamPokemon
  second: TeamPokemon
}

function PartyMatchupSnapshot({ matchup }: { matchup: Matchup }) {
  const firstHasEdge = matchup.first.statsTotal >= matchup.second.statsTotal
  const secondHasEdge = matchup.second.statsTotal >= matchup.first.statsTotal

  return (
    <div
      data-testid="party-matchup-snapshot"
      className="grid min-w-0 max-w-full gap-3 overflow-hidden"
    >
      {[matchup.first, matchup.second].map((member, index) => {
        const hasEdge = index === 0 ? firstHasEdge : secondHasEdge
        const strongestStat = getStrongestStat(member)

        return (
          <div
            key={member.instanceId}
            className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-muted/50 p-3 dark:border-white/10 dark:bg-slate-950/50"
          >
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-black text-foreground dark:text-white">
                  {formatPokemonName(member.name)}
                </p>
                <p className="break-words text-xs text-muted-foreground dark:text-slate-400">
                  Strongest stat: {formatStatName(strongestStat.name)}{" "}
                  {strongestStat.value}
                </p>
              </div>
              {hasEdge ? (
                <Badge className="max-w-full whitespace-normal break-words bg-primary text-primary-foreground dark:bg-pokemon-yellow dark:text-slate-950">
                  Edge
                </Badge>
              ) : null}
            </div>
            <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-3">
              <span className="break-words text-sm font-semibold text-muted-foreground dark:text-slate-300">
                Total {member.statsTotal}
              </span>
              <div className="flex min-w-0 flex-wrap justify-end gap-1.5">
                {member.types.map((type) => (
                  <PokemonTypeBadge
                    key={type}
                    typeName={type}
                    className="max-w-full whitespace-normal break-words"
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

type Preview = {
  averageStatsTotal: number
  fastest: TeamPokemon
  powerLead: TeamPokemon
  risk: string
  verdict: string
}

function BattlePreview({ preview }: { preview: Preview }) {
  return (
    <div
      data-testid="battle-preview"
      className="grid min-w-0 max-w-full gap-3 overflow-hidden"
    >
      <PreviewRow
        icon={<Gauge className="size-4 text-primary dark:text-pokemon-yellow" />}
        label="Average total"
        value={preview.averageStatsTotal.toString()}
      />
      <PreviewRow
        icon={<Target className="size-4 text-primary dark:text-pokemon-yellow" />}
        label="Fastest"
        value={formatPokemonName(preview.fastest.name)}
      />
      <PreviewRow
        icon={<Swords className="size-4 text-primary dark:text-pokemon-yellow" />}
        label="Power Lead"
        value={formatPokemonName(preview.powerLead.name)}
      />
      <PreviewRow
        icon={<ShieldAlert className="size-4 text-primary dark:text-pokemon-yellow" />}
        label="Risk"
        value={preview.risk}
      />
      <p className="break-words whitespace-normal rounded-lg border border-border bg-muted/50 p-3 text-sm leading-6 text-muted-foreground dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300">
        Verdict: {preview.verdict}
      </p>
    </div>
  )
}

function PreviewRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="grid min-w-0 gap-1 rounded-lg bg-muted/50 px-3 py-2 dark:bg-slate-950/50">
      <span className="flex min-w-0 flex-wrap items-center gap-2 break-words text-sm text-muted-foreground dark:text-slate-400">
        {icon}
        {label}
      </span>
      <span className="min-w-0 break-words whitespace-normal text-sm font-bold text-foreground dark:text-white">
        {value}
      </span>
    </div>
  )
}

function InsightBlock({
  title,
  empty,
  items,
}: {
  title: string
  empty: string
  items: string[]
}) {
  return (
    <div className="min-w-0 max-w-full overflow-hidden">
      <p className="break-words text-sm font-bold text-foreground dark:text-white">
        {title}
      </p>
      {items.length === 0 ? (
        <p className="mt-2 break-words text-sm text-muted-foreground dark:text-slate-400">
          {empty}
        </p>
      ) : (
        <div className="mt-2 flex min-w-0 flex-wrap gap-2">
          {items.map((item) => (
            <Badge
              key={item}
              variant="outline"
              className="h-auto min-h-5 max-w-full whitespace-normal break-words rounded-md border-border px-2 py-1 text-left text-xs leading-relaxed text-foreground dark:border-white/10 dark:text-slate-200"
            >
              {item}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function getPartyMatchup(team: TeamPokemon[]): Matchup | null {
  if (team.length < 2) {
    return null
  }

  const [first, second] = [...team].sort(
    (left, right) => right.statsTotal - left.statsTotal,
  )

  return first && second ? { first, second } : null
}

function getBattlePreview(
  team: TeamPokemon[],
  insights: TeamInsights,
): Preview | null {
  if (team.length === 0) {
    return null
  }

  const fastest = [...team].sort(
    (left, right) => getSpeed(right) - getSpeed(left),
  )[0]
  const powerLead = [...team].sort(
    (left, right) => getPowerScore(right) - getPowerScore(left),
  )[0]
  const highRiskWeakness = insights.weaknesses.find((entry) => entry.count >= 2)
  const averageStatsTotal = Math.round(
    team.reduce((total, member) => total + member.statsTotal, 0) / team.length,
  )

  if (!fastest || !powerLead) {
    return null
  }

  return {
    averageStatsTotal,
    fastest,
    powerLead,
    risk: highRiskWeakness
      ? `${formatPokemonName(highRiskWeakness.type)} pressure x${highRiskWeakness.count}`
      : "No repeated weakness pressure",
    verdict: getBattleVerdict(insights.score, Boolean(highRiskWeakness)),
  }
}

function getBattleVerdict(score: number, hasHighRiskWeakness: boolean) {
  if (score === 0) {
    return "Add Pokemon to unlock party projections."
  }

  if (score >= 70 && !hasHighRiskWeakness) {
    return "Strong offense with stable coverage."
  }

  if (score >= 70) {
    return "Strong offense, watch shared weaknesses."
  }

  if (score >= 40) {
    return "Promising core, add coverage before tougher battles."
  }

  return "Training party detected; add more roles and coverage."
}

function getStrongestStat(member: TeamPokemon) {
  const stats = member.stats ?? []

  if (stats.length === 0) {
    return { name: "total", value: member.statsTotal }
  }

  return stats.reduce((strongest, stat) =>
    stat.value > strongest.value ? stat : strongest,
  )
}

function getStatValue(member: TeamPokemon, statName: string) {
  return member.stats?.find((stat) => stat.name === statName)?.value
}

function getSpeed(member: TeamPokemon) {
  return getStatValue(member, "speed") ?? member.statsTotal
}

function getPowerScore(member: TeamPokemon) {
  return (
    Math.max(
      getStatValue(member, "attack") ?? 0,
      getStatValue(member, "special-attack") ?? 0,
    ) || member.statsTotal
  )
}

function formatStatName(statName: string) {
  const statLabels: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
    total: "Total",
  }

  return statLabels[statName] ?? formatPokemonName(statName)
}
