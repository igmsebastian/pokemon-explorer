import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type ActivePokemonState = {
  activePokemonName: string | null
  activePokemonImage: string | null
  setActivePokemon: (pokemon: {
    name: string
    image: string | null
  }) => void
}

export const useActivePokemonStore = create<ActivePokemonState>()(
  persist(
    (set) => ({
      activePokemonName: null,
      activePokemonImage: null,
      setActivePokemon: ({ name, image }) =>
        set({
          activePokemonName: name,
          activePokemonImage: image,
        }),
    }),
    {
      name: "pokemon-active-mobile-nav",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)
