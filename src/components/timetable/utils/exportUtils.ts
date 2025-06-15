import { toCanvas, toPng } from "html-to-image";
import ical, { ICalCalendarMethod } from "ical-generator";
import jsPDF from "jspdf";

import type { Timetable } from "@/types/primitives/timetable";
import { APP_CONFIG } from "@/config";
import {
  getExamsFromTimetable,
  getRecurringEvents,
} from "@/utils/timetable/timetable";

export const exportAsPdfOrImage = async (
  element: HTMLDivElement,
  type: "png" | "pdf",
) => {
  // Get the timetable container (first child with min-width)
  const timetableContainer = element.querySelector(
    '[class*="min-w-"]',
  ) as HTMLElement;

  if (!timetableContainer) {
    // Fallback to original behavior if container not found
    if (type === "pdf") {
      const canvas = await toCanvas(element, { quality: 1 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(
        `smumods_${APP_CONFIG.academicYear}_${APP_CONFIG.currentTerm}.pdf`,
      );
    } else {
      const image = await toPng(element, { quality: 1 });
      download(
        image,
        `smumods_${APP_CONFIG.academicYear}_${APP_CONFIG.currentTerm}.png`,
      );
    }
    return;
  }

  // Store original styles
  const originalTransform = timetableContainer.style.transform;
  const originalTransformOrigin = timetableContainer.style.transformOrigin;
  const originalHeight = element.style.height;

  // Calculate scale factor to fit viewport
  const viewportWidth = window.innerWidth;
  const containerWidth = timetableContainer.scrollWidth;
  const containerHeight = timetableContainer.scrollHeight;
  const scale = Math.min(1, (viewportWidth * 0.85) / containerWidth); // 85% of viewport for padding

  // Apply scale and adjust container height
  timetableContainer.style.transformOrigin = "top left";
  timetableContainer.style.transform = `scale(${scale})`;

  // Adjust parent container height to match scaled content
  const scaledHeight = containerHeight * scale;
  element.style.height = `${scaledHeight}px`;

  try {
    if (type === "pdf") {
      const canvas = await toCanvas(element, {
        quality: 1,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(
        `smumods_${APP_CONFIG.academicYear}_${APP_CONFIG.currentTerm}.pdf`,
      );
    } else {
      const image = await toPng(element, {
        quality: 1,
      });
      download(
        image,
        `smumods_${APP_CONFIG.academicYear}_${APP_CONFIG.currentTerm}.png`,
      );
    }
  } finally {
    // Restore original styles
    timetableContainer.style.transform = originalTransform;
    timetableContainer.style.transformOrigin = originalTransformOrigin;
    element.style.height = originalHeight;
  }
};

export const exportClassesICal = (timetable: Timetable) => {
  const calendar = ical({
    name: "smumods-classes-timetable",
    prodId: "-//smumods.johnnyknl.me//EN",
  });

  calendar.method(ICalCalendarMethod.PUBLISH);

  const classes = getRecurringEvents(timetable);
  classes.forEach((event) => {
    calendar.createEvent(event);
  });

  const string = calendar.toString();
  const blob = new Blob([string], {
    type: "text/calendar;charset=utf-8",
  });
  download(
    URL.createObjectURL(blob),
    `smumods_classes_${APP_CONFIG.academicYear}_${APP_CONFIG.currentTerm}.ics`,
  );
};

export const exportExamsICal = (timetable: Timetable) => {
  const examsCalendar = ical({
    name: "smumods-exams-timetable",
    prodId: "-//smumods.johnnyknl.me//EN",
  });

  const exams = getExamsFromTimetable(timetable);
  exams.forEach((event) => {
    examsCalendar.createEvent(event);
  });

  const examsString = examsCalendar.toString();
  const examsBlob = new Blob([examsString], {
    type: "text/calendar;charset=utf-8",
  });
  download(
    URL.createObjectURL(examsBlob),
    `smumods_exams_${APP_CONFIG.academicYear}_${APP_CONFIG.currentTerm}.ics`,
  );
};

const download = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
