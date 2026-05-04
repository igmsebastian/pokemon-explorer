const ONE_MINUTE = 60 * 1000

export const appConfig = {
  pokeApi: {
    baseUrl: getEnvString(
      "VITE_POKE_API_BASE_URL",
      "https://pokeapi.co/api/v2",
    ).replace(/\/$/, "")
  },
  query: {
    retry: getEnvInteger("VITE_QUERY_RETRY", 2, { min: 0, max: 5 }),
    staleTime: getEnvInteger("VITE_QUERY_STALE_TIME_MS", 5 * ONE_MINUTE, {
      min: 0,
    }),
    gcTime: getEnvInteger("VITE_QUERY_GC_TIME_MS", 30 * ONE_MINUTE, {
      min: ONE_MINUTE,
    }),
    refetchOnWindowFocus: getEnvBoolean(
      "VITE_QUERY_REFETCH_ON_WINDOW_FOCUS",
      false,
    ),
  },
  pokemon: {
    listPageSize: getEnvInteger("VITE_POKEMON_LIST_PAGE_SIZE", 20, {
      min: 1,
      max: 50,
    }),
    catalogStaleTime: getEnvInteger(
      "VITE_POKEMON_CATALOG_STALE_TIME_MS",
      30 * ONE_MINUTE,
      { min: 0 },
    ),
    typeStaleTime: getEnvInteger(
      "VITE_POKEMON_TYPE_STALE_TIME_MS",
      60 * ONE_MINUTE,
      { min: 0 },
    ),
    searchDebounceMs: getEnvInteger("VITE_POKEMON_SEARCH_DEBOUNCE_MS", 250, {
      min: 0,
      max: 1000,
    }),
  },
} as const

type IntegerOptions = {
  min?: number
  max?: number
}

function getEnvString(key: keyof ImportMetaEnv, fallback: string) {
  const rawValue = import.meta.env[key]
  const value = typeof rawValue === "string" ? rawValue.trim() : ""

  return value || fallback
}

function getEnvInteger(
  key: keyof ImportMetaEnv,
  fallback: number,
  options: IntegerOptions = {},
) {
  const rawValue = import.meta.env[key]
  const parsedValue =
    typeof rawValue === "string" ? Number.parseInt(rawValue, 10) : Number.NaN
  const value = Number.isFinite(parsedValue) ? parsedValue : fallback
  const minCheckedValue =
    typeof options.min === "number" ? Math.max(value, options.min) : value

  return typeof options.max === "number"
    ? Math.min(minCheckedValue, options.max)
    : minCheckedValue
}

function getEnvBoolean(key: keyof ImportMetaEnv, fallback: boolean) {
  const rawValue = import.meta.env[key]

  if (typeof rawValue !== "string") {
    return fallback
  }

  const normalizedValue = rawValue.trim().toLowerCase()

  if (["true", "1", "yes", "on"].includes(normalizedValue)) {
    return true
  }

  if (["false", "0", "no", "off"].includes(normalizedValue)) {
    return false
  }

  return fallback
}
