import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type ExploreState = {
  searchTerm: string
  selectedType: string
  scrollY: number
  setSearchTerm: (searchTerm: string) => void
  setSelectedType: (selectedType: string) => void
  setScrollY: (scrollY: number) => void
}

export const useExploreStateStore = create<ExploreState>()(
  persist(
    (set) => ({
      searchTerm: "",
      selectedType: "all",
      scrollY: 0,
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setSelectedType: (selectedType) => set({ selectedType }),
      setScrollY: (scrollY) => set({ scrollY }),
    }),
    {
      name: "pokemon-explorer-ui-state",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
