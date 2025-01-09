import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ModuleBank } from "@/types/banks/moduleBank";
import type { Basket } from "@/types/primitives/basket";
import type { Track } from "@/types/primitives/major";
import type { Module, ModuleCode } from "@/types/primitives/module";
import { baskets } from "@/server/data/basket";
import { modules } from "@/server/data/moduleBank";
import { Logger } from "@/utils/Logger";

export type ModuleBankActions = {
  addModule: (module: Module) => void;
  getModule: (moduleCode: ModuleCode) => Promise<Module>;
  fetchAndAddModule: (moduleCode: ModuleCode) => Promise<Module>;
  toggleFavourites: (moduleCode: ModuleCode) => void;
  getFavouriteModules: () => ModuleCode[];
  refreshModuleBank: () => Promise<void>;
  refreshBaskets: () => Promise<void>;
  refreshAll: () => Promise<void>;
};

export type ModuleBankStore = {
  modules: ModuleBank;
  favouriteModules: ModuleCode[];
  baskets: Basket<Track>[];
} & ModuleBankActions;

export const defaultInitState: ModuleBank = modules;
export const defaultBaskets: Basket<Track>[] = baskets;
export const defaultFavouriteModules: ModuleCode[] = [];

export const createModuleBank = (
  initModuleBank: ModuleBank = defaultInitState,
  initFavouriteModules: ModuleCode[] = defaultFavouriteModules,
  initBaskets: Basket<Track>[] = defaultBaskets,
) => {
  return create<ModuleBankStore>()(
    persist(
      (set, get) => ({
        modules: initModuleBank,
        favouriteModules: initFavouriteModules,
        baskets: initBaskets,
        toggleFavourites: (moduleCode) => {
          const originalFavourites = get().favouriteModules;
          const setFavourites = new Set(originalFavourites);
          if (setFavourites.has(moduleCode)) {
            setFavourites.delete(moduleCode);
          } else {
            setFavourites.add(moduleCode);
          }
          set((state) => {
            return {
              ...state,
              favouriteModules: Array.from(setFavourites),
            };
          });
        },
        getFavouriteModules: () => {
          const originalFavourites = get().favouriteModules;
          return originalFavourites;
        },
        addModule: (module) => {
          set((state) => {
            return {
              ...state,
              modules: {
                ...state.modules,
                [module.moduleCode]: module,
              },
            };
          });
        },
        getModule: async (moduleCode) => {
          const state = get();
          if (state.modules[moduleCode]) {
            return state.modules[moduleCode];
          }
          return get().fetchAndAddModule(moduleCode);
        },
        fetchAndAddModule: async (moduleCode) => {
          try {
            const res = await fetch(`/api/module/get?moduleCode=${moduleCode}`);
            const moduleData = (await res.json()) as Module;
            get().addModule(moduleData);
            return moduleData;
          } catch (error) {
            Logger.error(`Error fetching module ${moduleCode}:`, error);
            throw error;
          }
        },
        refreshModuleBank: async () => {
          try {
            const res = await fetch(`/api/module/getAll`);
            const moduleData = (await res.json()) as ModuleBank;
            set((state) => {
              return {
                ...state,
                modules: moduleData,
              };
            });
            toast.success("Module Bank refreshed!");
          } catch (error) {
            Logger.error(`Error fetching all modules:`, error);
            throw error;
          }
        },
        refreshBaskets: async () => {
          try {
            const res = await fetch(`/api/basket/getAll`);
            const basketData = (await res.json()) as Basket<Track>[];
            set((state) => {
              return {
                ...state,
                baskets: basketData,
              };
            });
            toast.success("Baskets refreshed!");
          } catch (error) {
            Logger.error(`Error fetching all baskets:`, error);
            throw error;
          }
        },
        refreshAll: async () => {
          await get().refreshModuleBank();
          await get().refreshBaskets();
        },
      }),
      {
        name: "moduleBank",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
};
