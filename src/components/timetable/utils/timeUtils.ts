import type { Day } from "@/types/primitives/timetable";
import { days } from "@/types/primitives/timetable";

export function calculateCurrentTimePosition(
  totalSlots: number
): number | null {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Return null if the current hour is not within the timetable time frame
  if (hours < 8 || hours >= 22) {
    return null;
  }

  const totalMinutes = (hours - 8) * 60 + minutes;
  const position = (totalMinutes / (60 * totalSlots)) * 100;
  return position;
}

export function getCurrentDay(): Day | null {
  let currentDayIdx = new Date().getDay();

  // Return null when it's sunday
  if (currentDayIdx === 0) {
    return null;
  } else {
    currentDayIdx -= 1;
  }
  return days[currentDayIdx] || null;
}
