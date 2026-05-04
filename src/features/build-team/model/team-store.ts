import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { getPokemonArtwork, getPokemonSprite } from "@/entities/pokemon/lib/artwork"
import type { PokemonDetail } from "@/entities/pokemon/model/types"

export const MAX_TEAM_SIZE = 6

export type TeamPokemon = {
  instanceId: string
  id: number
  name: string
  artwork: string
  sprite: string
  types: string[]
  primaryType: string
  stats?: Array<{ name: string; value: number }>
  statsTotal: number
}

export type AddPokemonResult = "added" | "full"

type TeamStore = {
  team: TeamPokemon[]
  addPokemon: (pokemon: TeamPokemon) => AddPokemonResult
  removePokemon: (instanceId: string) => void
  clearTeam: () => void
  getPokemonPartyCount: (pokemonName: string) => number
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      team: [],
      addPokemon: (pokemon) => {
        if (get().team.length >= MAX_TEAM_SIZE) {
          return "full"
        }

        set((state) => ({ team: [...state.team, pokemon] }))
        return "added"
      },
      removePokemon: (instanceId) => {
        set((state) => ({
          team: state.team.filter((member) => member.instanceId !== instanceId),
        }))
      },
      clearTeam: () => set({ team: [] }),
      getPokemonPartyCount: (pokemonName) =>
        get().team.filter((member) => member.name === pokemonName).length,
    }),
    {
      name: "pokemon-team-lab",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      partialize: (state) => ({ team: state.team }),
      migrate: (persistedState) => ({
        team: normalizePersistedTeam(persistedState),
      }),
    },
  ),
)

export function createTeamPokemon(pokemon: PokemonDetail): TeamPokemon {
  const types = pokemon.types.map(({ type }) => type.name)

  return {
    instanceId: createPokemonInstanceId(pokemon.name),
    id: pokemon.id,
    name: pokemon.name,
    artwork: getPokemonArtwork(pokemon),
    sprite: getPokemonSprite(pokemon),
    types,
    primaryType: types[0] ?? "normal",
    stats: pokemon.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    })),
    statsTotal: pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0),
  }
}

function createPokemonInstanceId(pokemonName: string) {
  return `${pokemonName}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function normalizePersistedTeam(persistedState: unknown): TeamPokemon[] {
  if (
    !persistedState ||
    typeof persistedState !== "object" ||
    !("team" in persistedState)
  ) {
    return []
  }

  const team = (persistedState as { team?: unknown }).team

  if (!Array.isArray(team)) {
    return []
  }

  return team.flatMap((member) => {
    if (!isPersistedTeamPokemon(member)) {
      return []
    }

    return [
      {
        ...member,
        instanceId:
          typeof member.instanceId === "string"
            ? member.instanceId
            : createPokemonInstanceId(member.name),
      },
    ]
  })
}

function isPersistedTeamPokemon(value: unknown): value is TeamPokemon {
  if (!value || typeof value !== "object") {
    return false
  }

  const member = value as Partial<TeamPokemon>

  return (
    typeof member.id === "number" &&
    typeof member.name === "string" &&
    typeof member.artwork === "string" &&
    typeof member.sprite === "string" &&
    Array.isArray(member.types) &&
    typeof member.primaryType === "string" &&
    typeof member.statsTotal === "number"
  )
}
