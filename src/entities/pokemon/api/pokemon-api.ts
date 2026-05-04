import { apiFetch, POKE_API_BASE_URL } from "@/shared/api/api-fetch"
import { TYPE_NAMES } from "@/entities/pokemon/lib/type-colors"
import {
  evolutionChainSchema,
  pokemonDetailSchema,
  pokemonListResponseSchema,
  pokemonSpeciesSchema,
  pokemonTypeDetailSchema,
  pokemonTypeListResponseSchema,
} from "@/entities/pokemon/model/schemas"
import type {
  EvolutionChain,
  PokemonDetail,
  PokemonListResponse,
  PokemonSpecies,
  PokemonTypeDetail,
  PokemonTypeListResponse,
} from "@/entities/pokemon/model/types"

export type PokemonListParams = {
  limit: number
  offset: number
}

export async function fetchPokemonList({
  limit,
  offset,
}: PokemonListParams): Promise<PokemonListResponse> {
  const url = `${POKE_API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  return apiFetch(url, pokemonListResponseSchema)
}

export async function fetchPokemonCatalog(): Promise<PokemonListResponse> {
  const url = `${POKE_API_BASE_URL}/pokemon?limit=1302&offset=0`
  return apiFetch(url, pokemonListResponseSchema)
}

export async function fetchPokemonDetail(
  nameOrId: string,
): Promise<PokemonDetail> {
  return apiFetch(
    `${POKE_API_BASE_URL}/pokemon/${nameOrId.toLowerCase()}`,
    pokemonDetailSchema,
  )
}

export async function fetchPokemonSpecies(
  nameOrId: string,
): Promise<PokemonSpecies> {
  return apiFetch(
    `${POKE_API_BASE_URL}/pokemon-species/${nameOrId.toLowerCase()}`,
    pokemonSpeciesSchema,
  )
}

export async function fetchEvolutionChain(
  url: string,
): Promise<EvolutionChain> {
  return apiFetch(url, evolutionChainSchema)
}

export async function fetchPokemonTypes(): Promise<PokemonTypeListResponse> {
  const response = await apiFetch(
    `${POKE_API_BASE_URL}/type`,
    pokemonTypeListResponseSchema,
  )

  return {
    results: response.results.filter((typeResource) =>
      TYPE_NAMES.includes(typeResource.name),
    ),
  }
}

export async function fetchPokemonByType(
  typeName: string,
): Promise<PokemonTypeDetail> {
  return apiFetch(
    `${POKE_API_BASE_URL}/type/${typeName}`,
    pokemonTypeDetailSchema,
  )
}
