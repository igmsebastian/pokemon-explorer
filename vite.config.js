import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined
          }

          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "react"
          }

          if (id.includes("@tanstack/react-query")) {
            return "query"
          }

          if (id.includes("radix-ui")) {
            return "radix"
          }

          if (id.includes("lucide-react")) {
            return "icons"
          }

          return "vendor"
        },
      },
    },
  },
})
