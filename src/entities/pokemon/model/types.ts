export type NamedApiResource = {
  name: string
  url: string
}

export type PokemonListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

export type PokemonTypeSlot = {
  slot: number
  type: NamedApiResource
}

export type PokemonStat = {
  base_stat: number
  stat: NamedApiResource
}

export type PokemonAbility = {
  ability: NamedApiResource
  is_hidden: boolean
  slot: number
}

export type PokemonMove = {
  move: NamedApiResource
}

export type PokemonDetail = {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  abilities: PokemonAbility[]
  moves: PokemonMove[]
  stats: PokemonStat[]
  sprites: {
    front_default: string | null
    other: {
      "official-artwork": {
        front_default: string | null
      }
      home?: {
        front_default: string | null
      }
    }
  }
  types: PokemonTypeSlot[]
}

export type PokemonSpecies = {
  id: number
  name: string
  color: NamedApiResource | null
  evolution_chain: {
    url: string
  } | null
  flavor_text_entries: Array<{
    flavor_text: string
    language: NamedApiResource
  }>
  genera: Array<{
    genus: string
    language: NamedApiResource
  }>
  habitat: NamedApiResource | null
}

export type EvolutionChainLink = {
  species: NamedApiResource
  evolves_to: EvolutionChainLink[]
}

export type EvolutionChain = {
  id: number
  chain: EvolutionChainLink
}

export type PokemonTypeListResponse = {
  results: NamedApiResource[]
}

export type PokemonTypeDetail = {
  pokemon: Array<{
    pokemon: NamedApiResource
  }>
}
