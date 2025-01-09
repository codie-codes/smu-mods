import type { ICalEventData } from "ical-generator";
import { ICalEventRepeatingFreq } from "ical-generator";
import { toast } from "sonner";

import type { Term } from "@/types/planner";
import type { Module, ModuleCode, Section } from "@/types/primitives/module";
import type {
  Day,
  ModifiableClass,
  Timetable,
} from "@/types/primitives/timetable";
import { APP_CONFIG } from "@/config";
import { modules } from "@/server/data/moduleBank";
import { days } from "@/types/primitives/timetable";

import type { TimetableThemeName } from "./colours";
import { TIMETABLE_THEMES } from "./colours";

export function findFreeColorIndex(
  timetable: Timetable,
  theme: TimetableThemeName,
) {
  for (let i = 0; i < timetable.modules.length; i++) {
    if (!timetable.modules.find((m) => m.colorIndex === i)) {
      return i;
    }
  }
  return timetable.modules.length % TIMETABLE_THEMES[theme].length;
}

export function toggleVisibility(moduleCode: ModuleCode, timetable: Timetable) {
  const updatedTimetable = JSON.parse(JSON.stringify(timetable)) as Timetable;
  const findModuleIndex = updatedTimetable.modules.findIndex(
    (m) => m.moduleCode === moduleCode,
  );
  const findModule = updatedTimetable.modules[findModuleIndex];
  if (!findModule) {
    toast.error("Module not found");
    return updatedTimetable;
  }
  const newVisibility = !findModule.visible;
  updatedTimetable.modules[findModuleIndex]!.visible = newVisibility;
  Object.keys(updatedTimetable)
    .filter((key) => key !== "modules")
    .forEach((day) => {
      updatedTimetable[day as Day] = updatedTimetable[day as Day].map(
        (classItem) => {
          if (classItem.moduleCode === moduleCode) {
            return {
              ...classItem,
              visible: newVisibility,
              isVisible: newVisibility,
            };
          }
          return classItem;
        },
      );
    });
  return updatedTimetable;
}

export function changeColorOfModule(
  moduleCode: ModuleCode,
  timetable: Timetable,
  colorIndex: number,
) {
  const updatedTimetable = JSON.parse(JSON.stringify(timetable)) as Timetable;
  const findModuleIndex = updatedTimetable.modules.findIndex(
    (m) => m.moduleCode === moduleCode,
  );
  const findModule = updatedTimetable.modules[findModuleIndex];
  if (!findModule) {
    toast.error("Module not found");
    return updatedTimetable;
  }
  updatedTimetable.modules[findModuleIndex]!.colorIndex = colorIndex;
  Object.keys(updatedTimetable)
    .filter((key) => key !== "modules")
    .forEach((day) => {
      updatedTimetable[day as Day] = updatedTimetable[day as Day].map(
        (classItem) => {
          if (classItem.moduleCode === moduleCode) {
            return {
              ...classItem,
              colorIndex,
            };
          }
          return classItem;
        },
      );
    });
  return updatedTimetable;
}

export function addModuleToTimetable(
  module: Module,
  timetable: Timetable,
  theme: TimetableThemeName,
  term: Term,
): Timetable {
  const updatedTimetable = JSON.parse(JSON.stringify(timetable)) as Timetable;
  const section = module.sections[0];
  if (!section) {
    toast.error("No sections available for this module");
    return updatedTimetable;
  }
  const findModule = updatedTimetable.modules.findIndex(
    (m) => m.moduleCode === module.moduleCode,
  );
  if (findModule !== -1) {
    toast.error(`${module.moduleCode} already added to timetable`);
    return updatedTimetable;
  }
  if (!module.terms.includes(term)) {
    toast.warning(`${module.moduleCode} not offered in ${term}`);
    return updatedTimetable;
  }
  const colorIndex = findFreeColorIndex(timetable, theme);
  section.classes.forEach((classTime) => {
    const modifiableClass: ModifiableClass = {
      moduleCode: module.moduleCode,
      section: section.code,
      classTime,
      isModifiable: true,
      isAvailable: true,
      isActive: true,
      colorIndex,
      isVisible: true,
    };
    if (!updatedTimetable[classTime.day]) {
      updatedTimetable[classTime.day] = [];
    }

    updatedTimetable[classTime.day].push(modifiableClass);
  });
  updatedTimetable.modules.push({
    ...module,
    colorIndex,
    visible: true,
  });
  toast.success(`${module.moduleCode} added to timetable`);
  return updatedTimetable;
}

export function showAllSections(
  module: Module,
  timetable: Timetable,
  theme: TimetableThemeName,
  currentSectionCode?: Section["code"],
): Timetable {
  const updatedTimetable = JSON.parse(JSON.stringify(timetable)) as Timetable;
  const tmp = timetable.modules.find((m) => m.moduleCode === module.moduleCode);
  module.sections.forEach((section) => {
    section.classes.forEach((classTime) => {
      updatedTimetable[classTime.day] = updatedTimetable[classTime.day].filter(
        (c) => c.moduleCode !== module.moduleCode,
      );
    });
  });
  module.sections.forEach((section) => {
    section.classes.forEach((classTime) => {
      let modifiableClass: ModifiableClass;
      if (section.code !== currentSectionCode) {
        modifiableClass = {
          moduleCode: module.moduleCode,
          section: section.code,
          classTime,
          isModifiable: true,
          isAvailable: true,
          isActive: true,
          isVisible: tmp?.visible ?? true,
          colorIndex: tmp?.colorIndex ?? findFreeColorIndex(timetable, theme),
        };
      } else {
        modifiableClass = {
          moduleCode: module.moduleCode,
          section: section.code,
          classTime,
          isModifiable: true,
          isAvailable: true,
          isActive: false,
          isVisible: tmp?.visible ?? true,
          colorIndex: tmp?.colorIndex ?? findFreeColorIndex(timetable, theme),
        };
      }

      if (!updatedTimetable[classTime.day]) {
        updatedTimetable[classTime.day] = [];
      }

      updatedTimetable[classTime.day].push(modifiableClass);
    });
  });

  return updatedTimetable;
}

export function selectSection(
  module: Module,
  timetable: Timetable,
  selectedSectionCode: string,
): Timetable {
  const updatedTimetable = JSON.parse(JSON.stringify(timetable)) as Timetable;

  days.forEach((day) => {
    updatedTimetable[day] = updatedTimetable[day].filter(
      (classItem) =>
        classItem.moduleCode !== module.moduleCode ||
        (classItem.section === selectedSectionCode &&
          classItem.moduleCode === module.moduleCode),
    );
  });

  return updatedTimetable;
}

export function getClassEndTime(startTime: string, duration: number) {
  // Parse the startTime into hours and minutes
  const [hoursStr, minutesStr] = startTime.split(":");
  const startHours = Number(hoursStr);
  const startMinutes = Number(minutesStr);

  // Validate the parsed hours and minutes
  if (
    isNaN(startHours) ||
    isNaN(startMinutes) ||
    startHours < 0 ||
    startHours >= 24 ||
    startMinutes < 0 ||
    startMinutes >= 60
  ) {
    throw new Error(`Invalid startTime: ${startTime}`);
  }

  // Validate the duration
  if (isNaN(duration) || duration < 0) {
    throw new Error(`Invalid duration: ${duration}`);
  }

  // Convert duration in hours to minutes
  const durationMinutes = duration * 60;

  // Calculate the total minutes and handle overflow
  let totalMinutes = startHours * 60 + startMinutes + durationMinutes;

  // Since totalMinutes may not be an integer due to fractional durations, round to the nearest minute
  totalMinutes = Math.round(totalMinutes);

  // Wrap around after 24 hours (1440 minutes)
  totalMinutes = totalMinutes % 1440;

  // Convert total minutes back to hours and minutes
  let endHours = Math.floor(totalMinutes / 60);
  let endMinutes = totalMinutes % 60;

  // Handle cases where endMinutes equals 60 after rounding
  if (endMinutes === 60) {
    endMinutes = 0;
    endHours = (endHours + 1) % 24;
  }

  // Format the end time with leading zeros if necessary
  const formattedHours = String(endHours).padStart(2, "0");
  const formattedMinutes = String(endMinutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

export function getRecurringEvents(timetable: Timetable): ICalEventData[] {
  const { termStartMonday, termEndSunday } = APP_CONFIG;

  const result: ICalEventData[] = [];

  const termStartDate = new Date(termStartMonday);
  const termEndDate = new Date(termEndSunday);

  // Mapping of day names to their numerical representation (0-6)
  const dayIndexes: { [key in Day]: number } = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  Object.keys(timetable).forEach((day) => {
    if (days.includes(day as Day)) {
      const classes = timetable[day as Day];
      if (classes) {
        for (const modClass of classes) {
          const { moduleCode, classTime } = modClass;
          const { startTime } = classTime;
          const endTime = getClassEndTime(startTime, classTime.duration);

          // Get the day index for the class day and term start day
          const classDayIndex = dayIndexes[day as Day];
          const termStartDayIndex = termStartDate.getDay(); // 0 (Sunday) to 6 (Saturday)

          // Calculate the number of days to add to termStartDate to get the first class date
          const daysToAdd = (classDayIndex - termStartDayIndex + 7) % 7;

          // Calculate the actual start date for the class
          const startDate = new Date(termStartDate);
          startDate.setDate(startDate.getDate() + daysToAdd);

          const module = modules[moduleCode];

          if (!module) {
            continue;
          }

          const section = module.sections.find(
            (section) => section.code === modClass.section,
          );

          result.push({
            start: new Date(
              `${startDate.toISOString().split("T")[0]}T${startTime}`,
            ),
            end: new Date(
              `${startDate.toISOString().split("T")[0]}T${endTime}`,
            ),
            summary: `[${moduleCode}] ${module.name}`,
            location:
              (section?.location.building ?? "") +
              " " +
              (section?.location.room ?? ""),
            description: moduleCode,
            repeating: {
              freq: ICalEventRepeatingFreq.WEEKLY,
              until: termEndDate,
            },
          });
        }
      }
    }
  });
  return result;
}

export function getSectionFromTimetable(
  timetable: Timetable,
  moduleCode: ModuleCode,
  module: Module,
): Section | undefined {
  let sectionCode: string | undefined;
  for (const day of days) {
    for (const classItem of timetable[day]) {
      if (classItem.moduleCode === moduleCode) {
        sectionCode = classItem.section;
        break;
      }
    }
  }
  if (!sectionCode) {
    return undefined;
  }
  return module?.sections.find((section) => section.code === sectionCode);
}
