import { FlaskConical, Search } from "lucide-react"
import { NavLink } from "react-router-dom"
import { ThemeSwitcher } from "@/features/theme/ui/theme-switcher"
import { TeamPartyPopover } from "./team-party-popover"
import type { ComponentType } from "react"

const navItems = [
  { to: "/", label: "Explore", icon: Search },
  { to: "/team-lab", label: "Team Lab", icon: PokeballIcon },
]

export function AppHeader() {
  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/90"
    >
      <div
        data-testid="mobile-header"
        className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8"
      >
        <NavLink to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-pokemon-red text-white shadow-lg shadow-red-500/25 sm:size-10">
            <FlaskConical className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black leading-none tracking-normal text-foreground sm:text-base dark:text-white">
              Pokemon Explorer
            </span>
            <span className="block truncate text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs sm:tracking-[0.2em] dark:text-pokemon-yellow">
              Research Lab
            </span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <HeaderLink key={item.to} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <TeamPartyPopover />
        </div>
      </div>
    </header>
  )
}

type HeaderLinkProps = {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
}

function HeaderLink({ to, label, icon: Icon }: HeaderLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition active:scale-[0.98]",
          isActive
            ? "bg-primary text-primary-foreground dark:bg-pokemon-yellow dark:text-slate-950"
            : "text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white",
        ].join(" ")
      }
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  )
}

function PokeballIcon({ className }: { className?: string }) {
  return (
    <img
      src="/pokeball.svg"
      alt=""
      className={["h-4 w-4 object-contain", className].filter(Boolean).join(" ")}
    />
  )
}
