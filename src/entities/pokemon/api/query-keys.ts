export const pokemonQueryKeys = {
  all: ["pokemon"] as const,
  lists: () => [...pokemonQueryKeys.all, "list"] as const,
  list: (params: object) => [...pokemonQueryKeys.lists(), params] as const,
  detail: (nameOrId: string) =>
    [...pokemonQueryKeys.all, "detail", nameOrId] as const,
  species: (nameOrId: string) =>
    [...pokemonQueryKeys.all, "species", nameOrId] as const,
  evolution: (url: string) =>
    [...pokemonQueryKeys.all, "evolution", url] as const,
  types: () => [...pokemonQueryKeys.all, "types"] as const,
  type: (typeName: string) =>
    [...pokemonQueryKeys.all, "type", typeName] as const,
}
