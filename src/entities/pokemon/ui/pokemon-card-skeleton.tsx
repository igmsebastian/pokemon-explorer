import { Card, CardContent, Skeleton } from "@/shared/ui"

export function PokemonCardSkeleton() {
  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card py-0 dark:border-white/10 dark:bg-white/[0.04]">
      <CardContent className="flex min-h-64 flex-1 flex-col gap-4 p-3 sm:min-h-72 sm:p-4">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-3 w-16 bg-muted dark:bg-white/10" />
            <Skeleton className="h-7 w-32 max-w-full bg-muted dark:bg-white/10" />
          </div>
          <Skeleton className="h-7 w-16 shrink-0 rounded-full bg-muted dark:bg-white/10" />
        </div>
        <Skeleton className="h-36 shrink-0 rounded-lg bg-muted dark:bg-white/10" />
        <div className="mt-auto flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full bg-muted dark:bg-white/10" />
          <Skeleton className="h-5 w-16 rounded-full bg-muted dark:bg-white/10" />
        </div>
        <Skeleton className="h-8 rounded-lg bg-muted dark:bg-white/10" />
      </CardContent>
    </Card>
  )
}
