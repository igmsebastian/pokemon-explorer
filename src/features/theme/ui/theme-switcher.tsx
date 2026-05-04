import { Check, Monitor, Moon, Sun } from "lucide-react"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui"
import { useThemeStore, type ThemeMode } from "@/features/theme/model/theme-store"

const themeOptions: Array<{
  mode: ThemeMode
  label: string
  description: string
  icon: typeof Moon
  testId: string
}> = [
  {
    mode: "dark",
    label: "Dark",
    description: "Research lab",
    icon: Moon,
    testId: "theme-option-dark",
  },
  {
    mode: "light",
    label: "Light",
    description: "Field notes",
    icon: Sun,
    testId: "theme-option-light",
  },
  {
    mode: "system",
    label: "System",
    description: "Device setting",
    icon: Monitor,
    testId: "theme-option-system",
  },
]

export function ThemeSwitcher() {
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)
  const activeOption =
    themeOptions.find((option) => option.mode === mode) ?? themeOptions[0]
  const ActiveIcon = activeOption.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          data-testid="theme-switcher"
          aria-label={`Change theme. Current theme: ${activeOption.label}`}
          className="border-border/70 bg-card/80 text-foreground shadow-sm backdrop-blur-md hover:bg-muted active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10"
        >
          <ActiveIcon className="size-4 text-primary dark:text-pokemon-yellow" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Display mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeOptions.map((option) => {
          const Icon = option.icon
          const isSelected = option.mode === mode

          return (
            <DropdownMenuItem
              key={option.mode}
              data-testid={option.testId}
              aria-current={isSelected ? "true" : undefined}
              onSelect={() => setMode(option.mode)}
              className={[
                "min-h-11",
                isSelected
                  ? "bg-secondary/10 text-foreground dark:bg-pokemon-yellow/10 dark:text-white"
                  : "",
              ].join(" ")}
            >
              <Icon className="size-4 text-primary dark:text-pokemon-yellow" />
              <span className="grid flex-1">
                <span>{option.label}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {option.description}
                </span>
              </span>
              {isSelected ? (
                <Check className="size-4 text-primary dark:text-pokemon-yellow" />
              ) : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
