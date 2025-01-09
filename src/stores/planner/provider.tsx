"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import type { PlannerStore } from "@/stores/planner";
import { createPlannerBank } from "@/stores/planner";

export type PlannerStoreApi = ReturnType<typeof createPlannerBank>;

export interface PlannerStoreProviderProps {
  children: ReactNode;
}

const PlannerStoreContext = createContext<PlannerStoreApi | undefined>(
  undefined,
);

export const PlannerStoreProvider = ({
  children,
}: PlannerStoreProviderProps) => {
  const storeRef = useRef<PlannerStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createPlannerBank();
  }

  return (
    <PlannerStoreContext.Provider value={storeRef.current}>
      {children}
    </PlannerStoreContext.Provider>
  );
};

export const usePlannerStore = <T,>(
  selector: (store: PlannerStore) => T,
): T => {
  const plannerStoreContext = useContext(PlannerStoreContext);

  if (!plannerStoreContext) {
    throw new Error(`usePlannerStore must be used within PlannerStoreProvider`);
  }

  return useStore(plannerStoreContext, selector);
};
