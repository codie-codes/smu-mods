import type { AcademicYear } from "@/config";
import type { Year } from "@/types/planner";
import { years } from "@/types/planner";

import { Logger } from "./Logger";

export function getUserYear(
  matriculationYear: AcademicYear,
  currentAcademicYear: AcademicYear,
): Year {
  const [_startYear, endYear] = currentAcademicYear.split("/").map(Number);
  const realMatriculationYear = Number(matriculationYear.split("/")[0]);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // because JavaScript sets 0 as the first month
  const currentYear = currentDate.getFullYear();
  let userYear = currentYear - realMatriculationYear + 1;
  if (currentYear == endYear && currentMonth <= 4) {
    userYear -= 1;
  }
  if (userYear >= 1 && userYear <= parseInt(years.at(-1)!)) {
    return String(userYear) as Year;
  } else {
    Logger.warn("Invalid user year calculation");
    return "1";
  }
}
