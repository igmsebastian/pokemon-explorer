import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query"
import {
  fetchEvolutionChain,
  fetchPokemonByType,
  fetchPokemonCatalog,
  fetchPokemonDetail,
  fetchPokemonList,
  fetchPokemonSpecies,
  fetchPokemonTypes,
} from "./pokemon-api"
import { pokemonQueryKeys } from "./query-keys"
import type { PokemonListResponse } from "@/entities/pokemon/model/types"
import { appConfig } from "@/shared/config/env"

const DEFAULT_PAGE_SIZE = appConfig.pokemon.listPageSize

export function usePokemonList(limit = DEFAULT_PAGE_SIZE) {
  return useInfiniteQuery<
    PokemonListResponse,
    Error,
    InfiniteData<PokemonListResponse>,
    ReturnType<typeof pokemonQueryKeys.list>,
    number
  >({
    queryKey: pokemonQueryKeys.list({ limit }),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchPokemonList({ limit, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length * limit : undefined,
  })
}

export function usePokemonCatalog(enabled: boolean) {
  return useQuery({
    queryKey: pokemonQueryKeys.list({ catalog: true }),
    queryFn: fetchPokemonCatalog,
    enabled,
    staleTime: appConfig.pokemon.catalogStaleTime,
  })
}

export function usePokemonDetail(nameOrId: string) {
  return useQuery({
    queryKey: pokemonQueryKeys.detail(nameOrId),
    queryFn: () => fetchPokemonDetail(nameOrId),
    enabled: Boolean(nameOrId),
  })
}

export function usePokemonSpecies(nameOrId: string) {
  return useQuery({
    queryKey: pokemonQueryKeys.species(nameOrId),
    queryFn: () => fetchPokemonSpecies(nameOrId),
    enabled: Boolean(nameOrId),
  })
}

export function useEvolutionChain(url: string | undefined) {
  return useQuery({
    queryKey: pokemonQueryKeys.evolution(url ?? "pending"),
    queryFn: () => {
      if (!url) {
        throw new Error("Evolution chain URL is required")
      }

      return fetchEvolutionChain(url)
    },
    enabled: Boolean(url),
  })
}

export function usePokemonTypes() {
  return useQuery({
    queryKey: pokemonQueryKeys.types(),
    queryFn: fetchPokemonTypes,
    staleTime: appConfig.pokemon.typeStaleTime,
  })
}

export function usePokemonNamesByType(typeName: string) {
  return useQuery({
    queryKey: pokemonQueryKeys.type(typeName),
    queryFn: () => fetchPokemonByType(typeName),
    enabled: typeName !== "all",
    staleTime: appConfig.pokemon.catalogStaleTime,
    select: (data) => data.pokemon.map((entry) => entry.pokemon.name),
  })
}
