import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { SchoolEvent } from "@/types/primitives/event";

export type ExtendedSchoolEvent = SchoolEvent & {
  id?: string;
};

export type EventStoreAction = {
  addEvent: (event: ExtendedSchoolEvent) => void;
  removeEvent: (eventId: string) => void;
};

export type EventStore = {
  events: ExtendedSchoolEvent[];
} & EventStoreAction;

export const createEventStore = () => {
  return create<EventStore>()(
    persist(
      (set) => ({
        events: [],
        addEvent: (event) => {
          const id = event.id ?? Math.random().toString(36);
          set((state) => ({ events: [...state.events, { ...event, id }] }));
        },
        removeEvent: (id) =>
          set((state) => ({
            events: state.events.filter((e) => e.id !== id),
          })),
      }),
      {
        name: "event",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
};
