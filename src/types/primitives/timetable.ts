import type { Term } from "../planner";
import type { Module, ModuleCode } from "./module";

export const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
] as const;

export const startingTime = [
  "08:15",
  "10:00",
  "12:00",
  "13:45",
  "15:30",
  "17:15",
  "19:00",
  "20:45",
] as const;
export const duration = [1.5, 3.25, 2.25] as const;

export type StartingTime = (typeof startingTime)[number];
export type Duration = (typeof duration)[number];

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
export type Day = (typeof days)[number];

export type ClassTime = {
  day: Day;
  startTime: StartingTime;
  duration: Duration;
};

export type Class = {
  moduleCode: ModuleCode;
  section: string;
  classTime: ClassTime;
};

export type ColorIndex = number;

type Modifiable = {
  isModifiable?: boolean;
  isAvailable?: boolean;
  isActive?: boolean;
  colorIndex: ColorIndex;
  isVisible: boolean;
};

export type ModifiableClass = Class & Modifiable;

export type Timetable = Record<Day, ModifiableClass[]> & {
  modules: (Module & { colorIndex: ColorIndex; visible: boolean })[];
};

export type TimetableMap = Record<Term, Timetable>;

export const defaultTimetable: Timetable = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  modules: [],
};

export const defaultTimetableMap: TimetableMap = {
  "Term 1": defaultTimetable,
  "Term 2": defaultTimetable,
  "Term 3A": defaultTimetable,
  "Term 3B": defaultTimetable,
};
