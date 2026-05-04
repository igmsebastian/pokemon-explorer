import { Badge } from "@/shared/ui"
import {
  getReadableTextColor,
  getTypeColor,
} from "@/entities/pokemon/lib/type-colors"
import { formatPokemonName } from "@/shared/lib/format"

type PokemonTypeBadgeProps = {
  typeName: string
  className?: string
}

export function PokemonTypeBadge({
  typeName,
  className,
}: PokemonTypeBadgeProps) {
  const color = getTypeColor(typeName)

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: color,
        color: getReadableTextColor(color),
        borderColor: color,
      }}
    >
      {formatPokemonName(typeName)}
    </Badge>
  )
}
