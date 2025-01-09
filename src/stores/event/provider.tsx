"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import type { EventStore } from "@/stores/event";
import { createEventStore } from "@/stores/event";

export type EventStoreApi = ReturnType<typeof createEventStore>;

export interface EventStoreProviderProps {
  children: ReactNode;
}

const EventStoreContext = createContext<EventStoreApi | undefined>(undefined);

export const EventStoreProvider = ({ children }: EventStoreProviderProps) => {
  const storeRef = useRef<EventStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createEventStore();
  }

  return (
    <EventStoreContext.Provider value={storeRef.current}>
      {children}
    </EventStoreContext.Provider>
  );
};

export const useEventStore = <T,>(selector: (store: EventStore) => T): T => {
  const eventStoreContext = useContext(EventStoreContext);

  if (!eventStoreContext) {
    throw new Error(`useEventStore must be used within EventStoreProvider`);
  }

  return useStore(eventStoreContext, selector);
};
