export function formatPokemonName(name: string) {
  return name
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function formatPokemonId(id: number) {
  return `#${id.toString().padStart(4, "0")}`
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase()
}
