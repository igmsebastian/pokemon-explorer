export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
}

export const TYPE_NAMES = Object.keys(TYPE_COLORS)

export function getTypeColor(typeName: string) {
  return TYPE_COLORS[typeName] ?? "#94A3B8"
}

export function getReadableTextColor(hexColor: string) {
  const normalizedColor = hexColor.replace("#", "")
  const red = Number.parseInt(normalizedColor.slice(0, 2), 16)
  const green = Number.parseInt(normalizedColor.slice(2, 4), 16)
  const blue = Number.parseInt(normalizedColor.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.62 ? "#111827" : "#FFFFFF"
}
