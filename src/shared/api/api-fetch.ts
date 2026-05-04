import type { ZodType } from "zod"
import { appConfig } from "@/shared/config/env"

export const POKE_API_BASE_URL = appConfig.pokeApi.baseUrl

export async function apiFetch<T>(
  url: string,
  schema?: ZodType<T>,
): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch API resource")
  }

  const data: unknown = await response.json()

  if (schema) {
    return schema.parse(data)
  }

  return data as T
}
