import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/shared/ui"
import { cn } from "@/lib/utils"

const SCROLL_THRESHOLD_PX = 500

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD_PX)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <Button
      type="button"
      size="icon-lg"
      data-testid="scroll-to-top-button"
      aria-label="Scroll to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={cn(
        "fixed bottom-6 right-6 z-50 hidden size-12 rounded-full border border-border bg-card text-foreground shadow-xl shadow-slate-950/15 transition-all duration-200 active:scale-95 dark:border-white/10 dark:bg-slate-950/90 dark:text-white dark:shadow-slate-950/60 md:flex",
        isVisible
          ? "visible translate-y-0 opacity-100"
          : "invisible pointer-events-none translate-y-2 opacity-0",
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp className="size-5 text-primary dark:text-pokemon-yellow" />
    </Button>
  )
}
