import { useRef } from "react";

import type {
  Day,
  ModifiableClass,
  Timetable,
} from "@/types/primitives/timetable";
import { cn } from "@/lib/utils";
import { timeSlots } from "@/types/primitives/timetable";
import { Logger } from "@/utils/Logger";
import {
  TIMETABLE_THEMES,
  TimetableThemeName,
} from "@/utils/timetable/colours";

import { CurrentTimeMarker } from "./CurrentTimeMarker";

type ClassWithWidth = ModifiableClass & {
  width: number;
};

type FullClass = ClassWithWidth & {
  paddingLeft: number;
};

type Row = Record<number, ClassWithWidth[]>;
type FullRow = Record<number, FullClass[]>;

interface TimetableGridProps {
  timetable: Timetable;
  timetableTheme: TimetableThemeName;
  selectedClass?: FullClass;
  currentTimePosition: number | null;
  hideCurrentTime: boolean;
  getCurrentDay: () => Day | null;
  onClassClick: (fullClass: FullClass) => void;
}

export function TimetableGrid({
  timetable,
  timetableTheme,
  selectedClass,
  currentTimePosition,
  hideCurrentTime,
  getCurrentDay,
  onClassClick,
}: TimetableGridProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  function timeToMinutes(timeStr: string): number {
    if (!timeStr || typeof timeStr !== "string") {
      throw new Error("Invalid time string");
    }

    const timeParts = timeStr.split(":");
    if (timeParts.length !== 2) {
      throw new Error("Invalid time format, expected 'HH:MM'");
    }

    const [hours, minutes] = timeParts.map((part) => {
      const value = Number(part);
      if (isNaN(value)) {
        throw new Error("Invalid time format, expected 'HH:MM'");
      }
      return value;
    });

    if (hours === undefined || minutes === undefined) {
      throw new Error("Invalid time format, expected 'HH:MM'");
    }

    return hours * 60 + minutes;
  }

  function calculateSlotWidth(duration: number, totalSlots: number) {
    const widthPercentage = (duration / totalSlots) * 100;
    return widthPercentage;
  }

  function getRowAssignment(day: ModifiableClass[], totalSlots: number) {
    const rows: Row = {
      0: [],
    };

    if (day.length < 1) {
      return rows;
    }

    // Sort timetable based on start time in minutes
    const sortedTimetable = day.sort(
      (a, b) =>
        timeToMinutes(a.classTime.startTime) -
        timeToMinutes(b.classTime.startTime),
    );

    for (let index = 0; index < sortedTimetable.length; index++) {
      const currentSlot = sortedTimetable[index]!;
      const currentSlotStartMinutes = timeToMinutes(
        currentSlot.classTime.startTime,
      );
      const currentSlotEndMinutes =
        currentSlotStartMinutes + currentSlot.classTime.duration * 60;

      let addedToRow = false;

      // Iterate over existing rows to find where we can add the current slot without overlap
      for (let rowIndex = 0; rowIndex < Object.keys(rows).length; rowIndex++) {
        const currentRow = rows[rowIndex]!;
        let canAddToRow = true;

        // Check overlap with all classes already in the current row
        for (let classIndex = 0; classIndex < currentRow.length; classIndex++) {
          const existingClass = currentRow[classIndex];
          if (existingClass) {
            const existingClassStartMinutes = timeToMinutes(
              existingClass.classTime.startTime,
            );
            const existingClassEndMinutes =
              existingClassStartMinutes + existingClass.classTime.duration * 60;

            if (
              currentSlotStartMinutes < existingClassEndMinutes &&
              currentSlotEndMinutes > existingClassStartMinutes
            ) {
              canAddToRow = false;
              break;
            }
          }
        }

        if (canAddToRow) {
          currentRow.push({
            ...currentSlot,
            width: calculateSlotWidth(
              currentSlot.classTime.duration,
              totalSlots,
            ),
          });
          addedToRow = true;
          break;
        }
      }

      // Add new row if not addedToRow
      if (!addedToRow) {
        const newRowIndex = Object.keys(rows).length;
        const width =
          ((currentSlot.classTime.duration * 60) / (60 * totalSlots)) * 100;
        rows[newRowIndex] = [
          {
            ...currentSlot,
            width: width,
          },
        ];
      }
    }
    return rows;
  }

  function calculateSlotLeftPadding(rows: Row, totalSlots: number): FullRow {
    const fullRows: FullRow = {};

    // Iterate through the row
    for (let rowIndex = 0; rowIndex < Object.keys(rows).length; rowIndex++) {
      const currentRow = rows[rowIndex];
      const updatedRow: FullClass[] = [];

      let totalLeftOffset = 0;

      for (let classIndex = 0; classIndex < currentRow!.length; classIndex++) {
        const currentClass = currentRow![classIndex];
        if (!currentClass) {
          continue;
        }
        const currentClassStartMinutes = timeToMinutes(
          currentClass.classTime.startTime,
        );

        let paddingLeft =
          ((currentClassStartMinutes - 480) / (60 * totalSlots)) * 100 -
          totalLeftOffset; // 480 mins = 08:00

        paddingLeft = Math.max(paddingLeft, 0);

        const durationInMinutes = currentClass.classTime.duration * 60;
        const width = (durationInMinutes / (60 * totalSlots)) * 100;

        totalLeftOffset += width + paddingLeft;

        const fullClass: FullClass = {
          ...currentClass,
          paddingLeft: totalLeftOffset - width,
        };

        updatedRow.push(fullClass);
      }
      fullRows[rowIndex] = updatedRow;
    }
    return fullRows;
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <div
        className="border-foreground/20 bg-background w-full min-w-[800px] overflow-hidden rounded-lg border lg:min-w-[1200px]"
        ref={elementRef}
      >
        {/* Time Labels */}
        <div className="flex">
          <div className="w-[7%] flex-shrink-0 md:w-[5%]"></div>
          {timeSlots.map((time, index) => (
            <div
              key={index}
              className={cn(
                "border-foreground/20 flex-1 items-center py-1 text-center",
                index % 2 === 0 ? "bg-border" : "bg-accent/50",
                index === 0 ? "border-none" : "border-l",
              )}
              style={{
                width: `${100 / 14}%`,
              }}
            >
              <span className="text-sm sm:text-xs">{time}</span>
            </div>
          ))}
        </div>

        {/* Timetable rows */}
        {Object.keys(timetable)
          .filter((key) => key != "modules")
          .map((day, dayIndex) => {
            const rowResult = getRowAssignment(timetable[day as Day], 15);
            const rowResultWithPadding = calculateSlotLeftPadding(
              rowResult,
              15,
            );
            return (
              <div className="flex border-t" key={dayIndex}>
                <div className="bg-background flex w-[7%] items-center justify-center text-center font-medium sm:text-xs md:w-[5%]">
                  {day.slice(0, 3)}
                </div>
                <div
                  className={`flex-grow space-y-1 py-1 ${
                    dayIndex % 2 === 0 ? "bg-border" : "bg-accent/50"
                  }`}
                  style={{ position: "relative" }}
                >
                  {/* Current time marker */}
                  <CurrentTimeMarker
                    position={currentTimePosition || 0}
                    isVisible={
                      getCurrentDay() === day &&
                      currentTimePosition !== null &&
                      !hideCurrentTime
                    }
                  />

                  {Object.keys(rowResultWithPadding).map((rowIndexStr) => {
                    const rowIndex = parseInt(rowIndexStr, 10);
                    const slotId = `${day}Slot${rowIndex}`;
                    let minHeight = 72;

                    if (typeof document !== "undefined") {
                      const row = document.getElementById(slotId);
                      for (
                        let index = 0;
                        index < (row?.children.length ?? 0);
                        index++
                      ) {
                        const element = row?.children.item(index);
                        if (
                          element?.scrollHeight &&
                          minHeight < element?.scrollHeight
                        ) {
                          minHeight = element.scrollHeight;
                          Logger.log(minHeight, slotId);
                        }
                      }
                    }

                    return (
                      <div
                        id={slotId}
                        key={rowIndex}
                        className="relative flex flex-row"
                        style={{
                          position: "relative",
                          minHeight: `${minHeight}px`,
                        }}
                      >
                        {rowResultWithPadding[rowIndex]!.map(
                          (fullClass, classIndex) => {
                            if (!fullClass.isVisible) {
                              return null;
                            }
                            const section = timetable.modules
                              .find(
                                (m) => m.moduleCode === fullClass.moduleCode,
                              )
                              ?.sections.find(
                                (s) => s.code === fullClass.section,
                              );
                            return (
                              <div
                                key={classIndex}
                                className={`absolute cursor-pointer content-center rounded-[0.5rem] p-1 shadow-md transition-all duration-1000 ${
                                  selectedClass?.section ===
                                    fullClass.section &&
                                  selectedClass?.moduleCode ===
                                    fullClass.moduleCode
                                    ? "animate-pop"
                                    : ""
                                }`}
                                style={{
                                  left: `${fullClass.paddingLeft}%`,
                                  width: `${fullClass.width}%`,
                                  maxWidth: `${fullClass.width}%`,
                                  height: `${minHeight}px`,
                                  backgroundColor:
                                    TIMETABLE_THEMES[timetableTheme][
                                      fullClass.colorIndex
                                    ]?.backgroundColor,
                                  color:
                                    TIMETABLE_THEMES[timetableTheme][
                                      fullClass.colorIndex
                                    ]?.textColor,
                                  opacity:
                                    !selectedClass ||
                                    (selectedClass.moduleCode ===
                                      fullClass.moduleCode &&
                                      selectedClass.section ===
                                        fullClass.section)
                                      ? 1
                                      : fullClass.moduleCode ===
                                          selectedClass?.moduleCode
                                        ? 0.6
                                        : 1,
                                  transition:
                                    "background-color 0.2s, transform 0.2s",
                                }}
                                onClick={() => onClassClick(fullClass)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    TIMETABLE_THEMES[timetableTheme][
                                      fullClass.colorIndex
                                    ]!.hoverBackgroundColor;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    TIMETABLE_THEMES[timetableTheme][
                                      fullClass.colorIndex
                                    ]!.backgroundColor;
                                }}
                              >
                                <p className="text-sm font-semibold">
                                  {`${fullClass.moduleCode} - ${fullClass.section}`}
                                </p>
                                <p className="text-xs">
                                  {`${fullClass.classTime.startTime} (${fullClass.classTime.duration} hrs)`}
                                </p>
                                <p className="text-xs">
                                  {section?.location.building +
                                    " " +
                                    section?.location.room}
                                </p>
                                <p className="text-xs">
                                  {section?.professor.name}
                                </p>
                              </div>
                            );
                          },
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
