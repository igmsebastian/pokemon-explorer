import type { Page, Route } from "@playwright/test"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

type FixturePokemon = {
  id: number
  name: string
  types: string[]
  baseStats: number[]
  evolutionFamily: "bulbasaur" | "charmander" | "squirtle" | "pikachu"
}

type EvolutionNode = {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionNode[]
}

const API_BASE_URL = getRequiredTestEnvValue("VITE_POKE_API_BASE_URL")

const fixturePokemon: FixturePokemon[] = [
  {
    id: 1,
    name: "bulbasaur",
    types: ["grass", "poison"],
    baseStats: [45, 49, 49, 65, 65, 45],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 2,
    name: "ivysaur",
    types: ["grass", "poison"],
    baseStats: [60, 62, 63, 80, 80, 60],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 3,
    name: "venusaur",
    types: ["grass", "poison"],
    baseStats: [80, 82, 83, 100, 100, 80],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 4,
    name: "charmander",
    types: ["fire"],
    baseStats: [39, 52, 43, 60, 50, 65],
    evolutionFamily: "charmander",
  },
  {
    id: 5,
    name: "charmeleon",
    types: ["fire"],
    baseStats: [58, 64, 58, 80, 65, 80],
    evolutionFamily: "charmander",
  },
  {
    id: 6,
    name: "charizard",
    types: ["fire", "flying"],
    baseStats: [78, 84, 78, 109, 85, 100],
    evolutionFamily: "charmander",
  },
  {
    id: 7,
    name: "squirtle",
    types: ["water"],
    baseStats: [44, 48, 65, 50, 64, 43],
    evolutionFamily: "squirtle",
  },
  {
    id: 8,
    name: "wartortle",
    types: ["water"],
    baseStats: [59, 63, 80, 65, 80, 58],
    evolutionFamily: "squirtle",
  },
  {
    id: 9,
    name: "blastoise",
    types: ["water"],
    baseStats: [79, 83, 100, 85, 105, 78],
    evolutionFamily: "squirtle",
  },
  {
    id: 25,
    name: "pikachu",
    types: ["electric"],
    baseStats: [35, 55, 40, 50, 50, 90],
    evolutionFamily: "pikachu",
  },
  {
    id: 16,
    name: "pidgey",
    types: ["normal", "flying"],
    baseStats: [40, 45, 40, 35, 35, 56],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 19,
    name: "rattata",
    types: ["normal"],
    baseStats: [30, 56, 35, 25, 35, 72],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 21,
    name: "spearow",
    types: ["normal", "flying"],
    baseStats: [40, 60, 30, 31, 31, 70],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 23,
    name: "ekans",
    types: ["poison"],
    baseStats: [35, 60, 44, 40, 54, 55],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 27,
    name: "sandshrew",
    types: ["ground"],
    baseStats: [50, 75, 85, 20, 30, 40],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 29,
    name: "nidoran-f",
    types: ["poison"],
    baseStats: [55, 47, 52, 40, 40, 41],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 35,
    name: "clefairy",
    types: ["fairy"],
    baseStats: [70, 45, 48, 60, 65, 35],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 37,
    name: "vulpix",
    types: ["fire"],
    baseStats: [38, 41, 40, 50, 65, 65],
    evolutionFamily: "charmander",
  },
  {
    id: 39,
    name: "jigglypuff",
    types: ["normal", "fairy"],
    baseStats: [115, 45, 20, 45, 25, 20],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 41,
    name: "zubat",
    types: ["poison", "flying"],
    baseStats: [40, 45, 35, 30, 40, 55],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 43,
    name: "oddish",
    types: ["grass", "poison"],
    baseStats: [45, 50, 55, 75, 65, 30],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 46,
    name: "paras",
    types: ["bug", "grass"],
    baseStats: [35, 70, 55, 45, 55, 25],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 48,
    name: "venonat",
    types: ["bug", "poison"],
    baseStats: [60, 55, 50, 40, 55, 45],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 50,
    name: "diglett",
    types: ["ground"],
    baseStats: [10, 55, 25, 35, 45, 95],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 52,
    name: "meowth",
    types: ["normal"],
    baseStats: [40, 45, 35, 40, 40, 90],
    evolutionFamily: "bulbasaur",
  },
  {
    id: 740,
    name: "crabominable",
    types: ["fighting", "ice"],
    baseStats: [97, 132, 77, 62, 67, 43],
    evolutionFamily: "squirtle",
  },
  {
    id: 782,
    name: "jangmo-o",
    types: ["dragon"],
    baseStats: [45, 55, 65, 45, 45, 45],
    evolutionFamily: "charmander",
  },
  {
    id: 783,
    name: "hakamo-o",
    types: ["dragon", "fighting"],
    baseStats: [55, 75, 90, 65, 70, 65],
    evolutionFamily: "charmander",
  },
  {
    id: 784,
    name: "kommo-o",
    types: ["dragon", "fighting"],
    baseStats: [75, 110, 125, 100, 105, 85],
    evolutionFamily: "charmander",
  },
  {
    id: 802,
    name: "marshadow",
    types: ["fighting", "ghost"],
    baseStats: [90, 125, 80, 90, 90, 125],
    evolutionFamily: "charmander",
  },
]

const typeNames = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
]

const statNames = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
]

export async function mockPokeApi(page: Page) {
  await page.route(`${API_BASE_URL}/**`, async (route) => {
    const response = getMockResponse(route)

    if (!response) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Not found" }),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    })
  })
}

function getMockResponse(route: Route): unknown {
  const requestUrl = new URL(route.request().url())
  const path = requestUrl.pathname.replace("/api/v2", "")

  if (path === "/pokemon") {
    const limit = Number(requestUrl.searchParams.get("limit") ?? "20")
    const offset = Number(requestUrl.searchParams.get("offset") ?? "0")
    const results = fixturePokemon.slice(offset, offset + limit).map(toNamedResource)
    const nextOffset = offset + limit

    return {
      count: fixturePokemon.length,
      next:
        nextOffset < fixturePokemon.length
          ? `${API_BASE_URL}/pokemon?limit=${limit}&offset=${nextOffset}`
          : null,
      previous:
        offset > 0 ? `${API_BASE_URL}/pokemon?limit=${limit}&offset=0` : null,
      results,
    }
  }

  if (path.startsWith("/pokemon/")) {
    const nameOrId = path.replace("/pokemon/", "")
    const pokemon = findPokemonFixture(nameOrId)
    return pokemon ? createPokemonDetail(pokemon) : null
  }

  if (path.startsWith("/pokemon-species/")) {
    const nameOrId = path.replace("/pokemon-species/", "")
    const pokemon = findPokemonFixture(nameOrId)
    return pokemon ? createPokemonSpecies(pokemon) : null
  }

  if (path === "/type") {
    return {
      results: typeNames.map((typeName, index) => ({
        name: typeName,
        url: `${API_BASE_URL}/type/${index + 1}`,
      })),
    }
  }

  if (path.startsWith("/type/")) {
    const typeName = path.replace("/type/", "")

    return {
      pokemon: fixturePokemon
        .filter((pokemon) => pokemon.types.includes(typeName))
        .map((pokemon) => ({ pokemon: toNamedResource(pokemon) })),
    }
  }

  if (path.startsWith("/evolution-chain/")) {
    const id = Number(path.replace("/evolution-chain/", ""))
    return createEvolutionChain(id)
  }

  return null
}

function createPokemonDetail(pokemon: FixturePokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    height: 7 + pokemon.id,
    weight: 60 + pokemon.id * 3,
    base_experience: 64 + pokemon.id,
    abilities: [
      {
        ability: {
          name: pokemon.types[0] === "electric" ? "static" : "overgrow",
          url: `${API_BASE_URL}/ability/1`,
        },
        is_hidden: false,
        slot: 1,
      },
      {
        ability: {
          name: "battle-focus",
          url: `${API_BASE_URL}/ability/2`,
        },
        is_hidden: true,
        slot: 3,
      },
    ],
    moves: ["tackle", "growl", "quick-attack", "protect", "swift", "slam"].map(
      (moveName) => ({
        move: { name: moveName, url: `${API_BASE_URL}/move/${moveName}` },
      }),
    ),
    stats: pokemon.baseStats.map((baseStat, index) => ({
      base_stat: baseStat,
      stat: {
        name: statNames[index],
        url: `${API_BASE_URL}/stat/${index + 1}`,
      },
    })),
    sprites: {
      front_default: createImageDataUrl(pokemon.name, pokemon.types[0]),
      other: {
        "official-artwork": {
          front_default: createImageDataUrl(pokemon.name, pokemon.types[0]),
        },
        home: {
          front_default: createImageDataUrl(pokemon.name, pokemon.types[0]),
        },
      },
    },
    types: pokemon.types.map((typeName, index) => ({
      slot: index + 1,
      type: { name: typeName, url: `${API_BASE_URL}/type/${typeName}` },
    })),
  }
}

function findPokemonFixture(nameOrId: string) {
  return fixturePokemon.find(
    (entry) => entry.name === nameOrId || entry.id.toString() === nameOrId,
  )
}

function createPokemonSpecies(pokemon: FixturePokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    color: {
      name: pokemon.types[0],
      url: `${API_BASE_URL}/pokemon-color/${pokemon.types[0]}`,
    },
    evolution_chain: {
      url: `${API_BASE_URL}/evolution-chain/${getEvolutionId(
        pokemon.evolutionFamily,
      )}`,
    },
    flavor_text_entries: [
      {
        flavor_text: `${pokemon.name} is a reliable research partner with sharp battle instincts.`,
        language: { name: "en", url: `${API_BASE_URL}/language/9` },
      },
    ],
    genera: [
      {
        genus: "Lab Pokemon",
        language: { name: "en", url: `${API_BASE_URL}/language/9` },
      },
    ],
    habitat: { name: "grassland", url: `${API_BASE_URL}/pokemon-habitat/3` },
  }
}

function createEvolutionChain(id: number) {
  const chains = {
    1: ["bulbasaur", "ivysaur", "venusaur"],
    2: ["charmander", "charmeleon", "charizard"],
    3: ["squirtle", "wartortle", "blastoise"],
    4: ["pichu", "pikachu", "raichu"],
  } satisfies Record<number, string[]>
  const names = chains[id] ?? chains[1]

  return {
    id,
    chain: names.reduceRight<EvolutionNode | null>(
      (nextStage, speciesName) => ({
        species: {
          name: speciesName,
          url: `${API_BASE_URL}/pokemon-species/${speciesName}`,
        },
        evolves_to: nextStage ? [nextStage] : [],
      }),
      null,
    ),
  }
}

function getEvolutionId(family: FixturePokemon["evolutionFamily"]) {
  const ids = {
    bulbasaur: 1,
    charmander: 2,
    squirtle: 3,
    pikachu: 4,
  } satisfies Record<FixturePokemon["evolutionFamily"], number>

  return ids[family]
}

function toNamedResource(pokemon: FixturePokemon) {
  return {
    name: pokemon.name,
    url: `${API_BASE_URL}/pokemon/${pokemon.name}`,
  }
}

function createImageDataUrl(name: string, typeName: string) {
  const colors: Record<string, string> = {
    grass: "#78C850",
    poison: "#A040A0",
    fire: "#F08030",
    flying: "#A890F0",
    water: "#6890F0",
    electric: "#F8D030",
    fighting: "#C03028",
    ice: "#98D8D8",
    dragon: "#7038F8",
    ghost: "#705898",
  }
  const color = colors[typeName] ?? "#94A3B8"
  const label = name.slice(0, 2).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" rx="32" fill="${color}"/><circle cx="90" cy="78" r="48" fill="white" fill-opacity=".35"/><text x="90" y="112" text-anchor="middle" font-family="Arial" font-size="44" font-weight="800" fill="#111827">${label}</text></svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function getRequiredTestEnvValue(key: string) {
  const value = process.env[key] ?? readEnvFileValue(key)

  if (!value) {
    throw new Error(`${key} is required for Playwright PokeAPI mocks.`)
  }

  return value.replace(/\/$/, "")
}

function readEnvFileValue(key: string) {
  for (const envFile of [".env.local", ".env", ".env.example"]) {
    const envPath = resolve(process.cwd(), envFile)

    if (!existsSync(envPath)) {
      continue
    }

    const entries = readFileSync(envPath, "utf8").split(/\r?\n/)

    for (const entry of entries) {
      const trimmedEntry = entry.trim()

      if (!trimmedEntry || trimmedEntry.startsWith("#")) {
        continue
      }

      const separatorIndex = trimmedEntry.indexOf("=")

      if (separatorIndex === -1) {
        continue
      }

      const entryKey = trimmedEntry.slice(0, separatorIndex).trim()

      if (entryKey !== key) {
        continue
      }

      return trimmedEntry.slice(separatorIndex + 1).trim()
    }
  }

  return undefined
}
