/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POKE_API_BASE_URL?: string
  readonly VITE_QUERY_RETRY?: string
  readonly VITE_QUERY_STALE_TIME_MS?: string
  readonly VITE_QUERY_GC_TIME_MS?: string
  readonly VITE_QUERY_REFETCH_ON_WINDOW_FOCUS?: string
  readonly VITE_POKEMON_LIST_PAGE_SIZE?: string
  readonly VITE_POKEMON_CATALOG_STALE_TIME_MS?: string
  readonly VITE_POKEMON_TYPE_STALE_TIME_MS?: string
  readonly VITE_POKEMON_SEARCH_DEBOUNCE_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
