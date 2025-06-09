"use client";

import { cn } from "@/lib/utils";
import { useConfigStore } from "@/stores/config/provider";
import {
  TIMETABLE_THEMES,
  TimetableThemeName,
} from "@/utils/timetable/colours";

export function ToggleTimetableTheme() {
  const { timetableTheme, changeTimetableTheme } = useConfigStore(
    (state) => state,
  );

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {Object.entries(TIMETABLE_THEMES).map(([themeName, theme], index) => {
        return (
          <div
            key={index}
            className={cn(
              "hover:border-foreground/30 w-full rounded-lg border p-2 shadow-sm md:w-fit",
              themeName == timetableTheme
                ? "border-primary"
                : "border-foreground/10",
            )}
            onClick={() =>
              changeTimetableTheme(themeName as TimetableThemeName)
            }
          >
            <div className="flex flex-col">
              <p className="text-center">
                {themeName
                  .replace(/_/g, " ")
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </p>
              <div className="flex justify-center">
                {theme.map((color, index) => (
                  <div
                    key={index}
                    className="size-4"
                    style={{
                      backgroundColor: color.backgroundColor,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
