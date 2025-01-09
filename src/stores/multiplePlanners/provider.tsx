"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import type { MultiplePlannerStore } from "@/stores/multiplePlanners";
import { createMultiplePlannerBank } from "@/stores/multiplePlanners";

export type MultiplePlannerStoreApi = ReturnType<
  typeof createMultiplePlannerBank
>;

export interface MultiplePlannerStoreProviderProps {
  children: ReactNode;
}

const MultiplePlannerStoreContext = createContext<
  MultiplePlannerStoreApi | undefined
>(undefined);

export const MultiplePlannerStoreProvider = ({
  children,
}: MultiplePlannerStoreProviderProps) => {
  const storeRef = useRef<MultiplePlannerStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createMultiplePlannerBank();
  }

  return (
    <MultiplePlannerStoreContext.Provider value={storeRef.current}>
      {children}
    </MultiplePlannerStoreContext.Provider>
  );
};

export const useMultiplePlannerStore = <T,>(
  selector: (store: MultiplePlannerStore) => T,
): T => {
  const multiplePlannerStoreContext = useContext(MultiplePlannerStoreContext);

  if (!multiplePlannerStoreContext) {
    throw new Error(
      `useMultiplePlannerStore must be used within MultiplePlannerStoreProvider`,
    );
  }

  return useStore(multiplePlannerStoreContext, selector);
};
