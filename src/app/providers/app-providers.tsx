import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/features/theme/ui/theme-provider"
import { TooltipProvider } from "@/shared/ui"
import { AppQueryClientProvider } from "./query-client-provider"
import type { ReactNode } from "react"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AppQueryClientProvider>
        <ThemeProvider />
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </AppQueryClientProvider>
    </BrowserRouter>
  )
}
