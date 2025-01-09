import { type ReactNode } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { type ExtendedSchoolEvent } from "@/stores/event";

import { Card } from "../ui/card";

interface EventCardProps {
  event: ExtendedSchoolEvent;
  actions?: ((
    event: ExtendedSchoolEvent,
    index: string | number,
  ) => ReactNode)[];
}

export const EventCard = ({ event, actions }: EventCardProps) => {
  return (
    <Card className="parent-event-card group text-center">
      {/* action button */}
      <div className="absolute left-2 top-2 z-10 flex gap-0">
        {actions?.map((action, index) => (
          <div key={index} className="flex-shrink-0">
            {action(event, index)}
          </div>
        ))}
      </div>

      {/* parent container */}
      <div className="relative h-full w-full overflow-hidden">
        {/* event title and organiser*/}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center space-y-1 transition-all duration-500 ease-in-out group-hover:translate-y-[-27%] md:p-4",
          )}
        >
          <h3 className="text-base font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-600 dark:text-white">{event.name}</p>
        </div>

        {/* more information (hidden initially) */}
        <div
          className={cn(
            "child-hidden-event-card text-left group-hover:translate-y-9",
          )}
        >
          <p>{format(new Date(event.date), "MMMM d, yyyy")}</p>
          <p className="text-sm">
            {format(new Date(event.startTime), "HH:mm")} to{" "}
            {format(new Date(event.endTime), "HH:mm")}
          </p>
          <p className="text-sm">{event.venue}</p>
          <p className="mt-2 text-red-400 dark:text-red-500">
            Registration Deadline:{" "}
            {format(new Date(event.deadline), "MMMM d, yyyy HH:mm")}
          </p>
        </div>
      </div>
    </Card>
  );
};
