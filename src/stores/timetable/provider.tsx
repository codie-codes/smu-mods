"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import type { TimetableStore } from "@/stores/timetable";
import { createTimetableStore } from "@/stores/timetable";

export type TimetableStoreApi = ReturnType<typeof createTimetableStore>;

export interface TimetableStoreProviderProps {
  children: ReactNode;
}

const TimetableStoreContext = createContext<TimetableStoreApi | undefined>(
  undefined,
);

export const TimetableStoreProvider = ({
  children,
}: TimetableStoreProviderProps) => {
  const storeRef = useRef<TimetableStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createTimetableStore();
  }

  return (
    <TimetableStoreContext.Provider value={storeRef.current}>
      {children}
    </TimetableStoreContext.Provider>
  );
};

export const useTimetableStore = <T,>(
  selector: (store: TimetableStore) => T,
): T => {
  const timetableStoreContext = useContext(TimetableStoreContext);

  if (!timetableStoreContext) {
    throw new Error(
      `useTimetableStore must be used within TimetableStoreProvider`,
    );
  }

  return useStore(timetableStoreContext, selector);
};
