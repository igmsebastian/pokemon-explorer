import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import { appConfig } from "@/shared/config/env"

export function AppQueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: appConfig.query.retry,
            staleTime: appConfig.query.staleTime,
            gcTime: appConfig.query.gcTime,
            refetchOnWindowFocus: appConfig.query.refetchOnWindowFocus,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
