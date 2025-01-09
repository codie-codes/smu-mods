import type { ReactNode } from "react";

import { type TermSlug } from "./types/planner";

export type AcademicYear = `${number}/${number}`;

export type Banner = {
  id: string;
  message: ReactNode;
};

export type Config = {
  academicYear: AcademicYear;
  currentTerm: TermSlug;
  banners: Banner[];
  termStartMonday: string;
  termEndSunday: string;
  majorMigrate: string;
};

export const PADDING = "2rem";

export const APP_CONFIG: Config = {
  academicYear: "2024/2025",
  currentTerm: "term-2",
  banners: [
    {
      id: "welcome",
      message: "Welcome to the new academic year!",
    },
    {
      id: "timetable",
      message: "Don't forget to plan your timetable for the upcoming term!",
    },
  ],
  termStartMonday: "2025-01-13",
  termEndSunday: "2025-04-20",
  majorMigrate: "plannerStoreMigrate",
};
