"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import type { ModuleBankStore } from "@/stores/moduleBank";
import { createModuleBank } from "@/stores/moduleBank";

export type ModuleBankStoreApi = ReturnType<typeof createModuleBank>;

export interface ModuleBankStoreProviderProps {
  children: ReactNode;
}

const ModuleBankStoreContext = createContext<ModuleBankStoreApi | undefined>(
  undefined,
);

export const ModuleBankStoreProvider = ({
  children,
}: ModuleBankStoreProviderProps) => {
  const storeRef = useRef<ModuleBankStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createModuleBank();
  }

  return (
    <ModuleBankStoreContext.Provider value={storeRef.current}>
      {children}
    </ModuleBankStoreContext.Provider>
  );
};

export const useModuleBankStore = <T,>(
  selector: (store: ModuleBankStore) => T,
): T => {
  const moduleBankStoreContext = useContext(ModuleBankStoreContext);

  if (!moduleBankStoreContext) {
    throw new Error(
      `useModuleBankStore must be used within ModuleBankStoreProvider`,
    );
  }

  return useStore(moduleBankStoreContext, selector);
};
