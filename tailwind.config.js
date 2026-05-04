/** @type {import("tailwindcss").Config} */
const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        pokemon: {
          red: "#FF0000",
          yellow: "#FFCB05",
          blue: "#3B4CCA",
          white: "#FFFFFF",
          dark: "#1F2937",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animationUtilities],
}

function animationUtilities({ addUtilities, addVariant, matchUtilities, theme }) {
  addVariant("data-open", [
    "&[data-state='open']",
    "&[data-open]:not([data-open='false'])",
  ])
  addVariant("data-closed", [
    "&[data-state='closed']",
    "&[data-closed]:not([data-closed='false'])",
  ])
  addVariant("data-checked", [
    "&[data-state='checked']",
    "&[data-checked]:not([data-checked='false'])",
  ])
  addVariant("data-unchecked", [
    "&[data-state='unchecked']",
    "&[data-unchecked]:not([data-unchecked='false'])",
  ])
  addVariant("data-selected", "&[data-selected='true']")
  addVariant("data-disabled", [
    "&[data-disabled='true']",
    "&[data-disabled]:not([data-disabled='false'])",
  ])
  addVariant("data-active", [
    "&[data-state='active']",
    "&[data-active]:not([data-active='false'])",
  ])
  addVariant("data-horizontal", "&[data-orientation='horizontal']")
  addVariant("data-vertical", "&[data-orientation='vertical']")

  addUtilities({
    "@keyframes enter": {
      from: {
        opacity: "var(--tw-enter-opacity, 1)",
        transform:
          "translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1))",
      },
    },
    "@keyframes exit": {
      to: {
        opacity: "var(--tw-exit-opacity, 1)",
        transform:
          "translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1))",
      },
    },
    "@keyframes accordion-down": {
      from: { height: "0" },
      to: { height: "var(--radix-accordion-content-height)" },
    },
    "@keyframes accordion-up": {
      from: { height: "var(--radix-accordion-content-height)" },
      to: { height: "0" },
    },
    ".animate-in": {
      animationName: "enter",
      animationDuration: "150ms",
      animationTimingFunction: "ease-out",
      animationFillMode: "both",
    },
    ".animate-out": {
      animationName: "exit",
      animationDuration: "150ms",
      animationTimingFunction: "ease-in",
      animationFillMode: "both",
    },
    ".animate-accordion-down": {
      animation: "accordion-down 200ms ease-out",
    },
    ".animate-accordion-up": {
      animation: "accordion-up 200ms ease-out",
    },
    ".no-scrollbar": {
      "-ms-overflow-style": "none",
      "scrollbar-width": "none",
    },
    ".no-scrollbar::-webkit-scrollbar": {
      display: "none",
    },
  })

  matchUtilities(
    {
      "fade-in": (value) => ({ "--tw-enter-opacity": value }),
      "fade-out": (value) => ({ "--tw-exit-opacity": value }),
    },
    {
      values: {
        0: "0",
        5: "0.05",
        10: "0.1",
        50: "0.5",
        75: "0.75",
        95: "0.95",
        100: "1",
      },
    },
  )

  matchUtilities(
    {
      "zoom-in": (value) => ({ "--tw-enter-scale": value }),
      "zoom-out": (value) => ({ "--tw-exit-scale": value }),
    },
    {
      values: {
        0: "0",
        50: "0.5",
        75: "0.75",
        90: "0.9",
        95: "0.95",
        100: "1",
      },
    },
  )

  matchUtilities(
    {
      "slide-in-from-top": (value) => ({
        "--tw-enter-translate-y": `-${value}`,
      }),
      "slide-in-from-bottom": (value) => ({
        "--tw-enter-translate-y": value,
      }),
      "slide-in-from-left": (value) => ({
        "--tw-enter-translate-x": `-${value}`,
      }),
      "slide-in-from-right": (value) => ({
        "--tw-enter-translate-x": value,
      }),
      "slide-out-to-top": (value) => ({
        "--tw-exit-translate-y": `-${value}`,
      }),
      "slide-out-to-bottom": (value) => ({
        "--tw-exit-translate-y": value,
      }),
      "slide-out-to-left": (value) => ({
        "--tw-exit-translate-x": `-${value}`,
      }),
      "slide-out-to-right": (value) => ({
        "--tw-exit-translate-x": value,
      }),
    },
    { values: theme("spacing") },
  )
}

export default config
