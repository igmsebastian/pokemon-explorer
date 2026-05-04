import { useEffect } from "react"
import {
  shouldUseDarkTheme,
  THEME_MEDIA_QUERY,
  useThemeStore,
} from "@/features/theme/model/theme-store"

export function ThemeProvider() {
  const mode = useThemeStore((state) => state.mode)

  useEffect(() => {
    const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY)
    const root = document.documentElement

    const applyTheme = () => {
      const isDark = shouldUseDarkTheme(mode, mediaQuery.matches)

      root.classList.toggle("dark", isDark)
      root.dataset.theme = mode
      root.style.colorScheme = isDark ? "dark" : "light"
    }

    applyTheme()

    if (mode !== "system") {
      return
    }

    mediaQuery.addEventListener("change", applyTheme)

    return () => {
      mediaQuery.removeEventListener("change", applyTheme)
    }
  }, [mode])

  return null
}
