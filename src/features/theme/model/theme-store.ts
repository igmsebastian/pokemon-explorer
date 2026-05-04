import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type ThemeMode = "light" | "dark" | "system"

type ThemeState = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const THEME_STORAGE_KEY = "pokemon-explorer-theme"
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)"

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "dark",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export function shouldUseDarkTheme(mode: ThemeMode, prefersDark: boolean) {
  return mode === "dark" || (mode === "system" && prefersDark)
}
