import { z } from "zod"
import type {
  EvolutionChain,
  EvolutionChainLink,
  PokemonDetail,
  PokemonListResponse,
  PokemonSpecies,
  PokemonTypeDetail,
  PokemonTypeListResponse,
} from "./types"

const namedApiResourceSchema = z.looseObject({
  name: z.string(),
  url: z.string(),
})

export const pokemonListResponseSchema = z.looseObject({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(namedApiResourceSchema),
}) satisfies z.ZodType<PokemonListResponse>

export const pokemonDetailSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number().nullable(),
  abilities: z.array(
    z.looseObject({
      ability: namedApiResourceSchema,
      is_hidden: z.boolean(),
      slot: z.number(),
    }),
  ),
  moves: z.array(
    z.looseObject({
      move: namedApiResourceSchema,
    }),
  ),
  stats: z.array(
    z.looseObject({
      base_stat: z.number(),
      stat: namedApiResourceSchema,
    }),
  ),
  sprites: z.looseObject({
    front_default: z.string().nullable(),
    other: z.looseObject({
      "official-artwork": z.looseObject({
        front_default: z.string().nullable(),
      }),
      home: z
        .looseObject({
          front_default: z.string().nullable(),
        })
        .optional(),
    }),
  }),
  types: z.array(
    z.looseObject({
      slot: z.number(),
      type: namedApiResourceSchema,
    }),
  ),
}) satisfies z.ZodType<PokemonDetail>

export const pokemonSpeciesSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  color: namedApiResourceSchema.nullable(),
  evolution_chain: z
    .looseObject({
      url: z.string(),
    })
    .nullable(),
  flavor_text_entries: z.array(
    z.looseObject({
      flavor_text: z.string(),
      language: namedApiResourceSchema,
    }),
  ),
  genera: z.array(
    z.looseObject({
      genus: z.string(),
      language: namedApiResourceSchema,
    }),
  ),
  habitat: namedApiResourceSchema.nullable(),
}) satisfies z.ZodType<PokemonSpecies>

const evolutionChainLinkSchema: z.ZodType<EvolutionChainLink> = z.lazy(() =>
  z.looseObject({
    species: namedApiResourceSchema,
    evolves_to: z.array(evolutionChainLinkSchema),
  }),
)

export const evolutionChainSchema = z.looseObject({
  id: z.number(),
  chain: evolutionChainLinkSchema,
}) satisfies z.ZodType<EvolutionChain>

export const pokemonTypeListResponseSchema = z.looseObject({
  results: z.array(namedApiResourceSchema),
}) satisfies z.ZodType<PokemonTypeListResponse>

export const pokemonTypeDetailSchema = z.looseObject({
  pokemon: z.array(
    z.looseObject({
      pokemon: namedApiResourceSchema,
    }),
  ),
}) satisfies z.ZodType<PokemonTypeDetail>
