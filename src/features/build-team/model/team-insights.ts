import { clamp, formatPokemonName } from "@/shared/lib/format"
import type { TeamPokemon } from "./team-store"

const IMPORTANT_COVERAGE_TYPES = [
  "water",
  "electric",
  "ground",
  "ice",
  "fairy",
  "fighting",
]

const TYPE_WEAKNESSES: Record<string, string[]> = {
  normal: ["fighting"],
  fire: ["water", "ground", "rock"],
  water: ["electric", "grass"],
  electric: ["ground"],
  grass: ["fire", "ice", "poison", "flying", "bug"],
  ice: ["fire", "fighting", "rock", "steel"],
  fighting: ["flying", "psychic", "fairy"],
  poison: ["ground", "psychic"],
  ground: ["water", "grass", "ice"],
  flying: ["electric", "ice", "rock"],
  psychic: ["bug", "ghost", "dark"],
  bug: ["fire", "flying", "rock"],
  rock: ["water", "grass", "fighting", "ground", "steel"],
  ghost: ["ghost", "dark"],
  dragon: ["ice", "dragon", "fairy"],
  dark: ["fighting", "bug", "fairy"],
  steel: ["fire", "fighting", "ground"],
  fairy: ["poison", "steel"],
}

export type TeamInsights = {
  score: number
  label: string
  duplicatePrimaryTypesCount: number
  duplicatePrimaryTypes: Array<{ type: string; count: number }>
  highRiskWeaknessCount: number
  typeCoverage: Array<{ type: string; count: number }>
  weaknesses: Array<{ type: string; count: number }>
  strongestTypes: string[]
  missingCoverageHints: string[]
}

export function getTeamInsights(team: TeamPokemon[]): TeamInsights {
  const allTypes = team.flatMap((member) => member.types)
  const uniqueAllTypes = new Set(allTypes)
  const uniquePrimaryTypes = new Set(team.map((member) => member.primaryType))
  const primaryTypeCounts = countValues(team.map((member) => member.primaryType))
  const duplicatePrimaryTypes = toSortedEntries(primaryTypeCounts).filter(
    (entry) => entry.count > 1,
  )
  const duplicatePrimaryTypeCount = Array.from(primaryTypeCounts.values()).reduce(
    (total, count) => total + Math.max(count - 1, 0),
    0,
  )
  const typeCoverage = Array.from(uniqueAllTypes)
    .map((type) => ({ type, count: 1 }))
    .sort((left, right) => left.type.localeCompare(right.type))
  const weaknesses = toSortedEntries(
    countValues(team.flatMap((member) => TYPE_WEAKNESSES[member.primaryType] ?? [])),
  ).slice(0, 5)
  const highRiskWeaknessCount = weaknesses.filter((entry) => entry.count >= 2).length
  const teamSizeScore = (team.length / 6) * 40
  const typeDiversityScore =
    team.length === 0 ? 0 : (uniquePrimaryTypes.size / team.length) * 30
  const coverageScore = Math.min(uniqueAllTypes.size / 10, 1) * 20
  const duplicatePenalty = duplicatePrimaryTypeCount * 5
  const weaknessPenalty = highRiskWeaknessCount * 3
  const score =
    team.length === 0
      ? 0
      : clamp(
          Math.round(
            teamSizeScore +
              typeDiversityScore +
              coverageScore -
              duplicatePenalty -
              weaknessPenalty,
          ),
          0,
          100,
        )
  const strongestTypes = toSortedEntries(primaryTypeCounts)
    .slice(0, 3)
    .map((entry) => entry.type)
  const missingCoverageHints = IMPORTANT_COVERAGE_TYPES.filter(
    (type) => !uniqueAllTypes.has(type),
  ).map((type) => `Add ${formatPokemonName(type)} coverage`)

  return {
    score,
    label: getBalanceLabel(score),
    duplicatePrimaryTypesCount: duplicatePrimaryTypeCount,
    duplicatePrimaryTypes,
    highRiskWeaknessCount,
    typeCoverage,
    weaknesses,
    strongestTypes,
    missingCoverageHints,
  }
}

function getBalanceLabel(score: number) {
  if (score === 0) {
    return "No Party Yet"
  }

  if (score <= 39) {
    return "Needs Training"
  }

  if (score <= 69) {
    return "Balanced Rookie"
  }

  if (score <= 89) {
    return "Elite Party"
  }

  return "Champion Ready"
}

function countValues(values: string[]) {
  return values.reduce((counts, value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1)
    return counts
  }, new Map<string, number>())
}

function toSortedEntries(counts: Map<string, number>) {
  return Array.from(counts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((left, right) => right.count - left.count || left.type.localeCompare(right.type))
}
