import type { PokemonDetail } from "@/entities/pokemon/model/types"

export function getPokemonArtwork(pokemon: PokemonDetail) {
  return (
    pokemon.sprites.other["official-artwork"].front_default ??
    pokemon.sprites.other.home?.front_default ??
    pokemon.sprites.front_default ??
    ""
  )
}

export function getPokemonSprite(pokemon: PokemonDetail) {
  return pokemon.sprites.front_default ?? getPokemonArtwork(pokemon)
}
