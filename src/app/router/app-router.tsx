import { Route, Routes } from "react-router-dom"
import { AppHeader } from "@/widgets/app-header/app-header"
import { HomePage } from "@/pages/home/home-page"
import { PokemonDetailPage } from "@/pages/pokemon-detail/pokemon-detail-page"
import { TeamLabPage } from "@/pages/team-lab/team-lab-page"
import { Button } from "@/shared/ui"
import { Link } from "react-router-dom"
import { MobileBottomNav } from "@/widgets/mobile-bottom-nav/mobile-bottom-nav"
import { ScrollToTopButton } from "@/widgets/scroll-to-top/scroll-to-top-button"

export function AppRouter() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppHeader />
      <main className="min-h-dvh">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
          <Route path="/team-lab" element={<TeamLabPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <ScrollToTopButton />
      <MobileBottomNav />
    </div>
  )
}

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary dark:border-pokemon-yellow/40 dark:bg-pokemon-yellow/10 dark:text-pokemon-yellow">
        Signal lost
      </div>
      <h1 className="text-4xl font-black tracking-normal text-pokemon-dark dark:text-white">
        This research file does not exist.
      </h1>
      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-pokemon-yellow dark:text-slate-950 dark:hover:bg-pokemon-yellow/90">
        <Link to="/">Return to command center</Link>
      </Button>
    </section>
  )
}
