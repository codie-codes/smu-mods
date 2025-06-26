import { format } from "date-fns";
import { Eye, EyeOff, Trash2 } from "lucide-react";

import type { Module, ModuleCode } from "@/types/primitives/module";
import type { Timetable } from "@/types/primitives/timetable";
import BidAnalyticsPopover from "@/components/BidAnalytics/Popover";
import ModuleDetails from "@/components/ModuleDetails";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TIMETABLE_THEMES,
  TimetableThemeName,
} from "@/utils/timetable/colours";
import { getSectionFromTimetable } from "@/utils/timetable/timetable";

interface ModuleCardProps {
  module: Module & { colorIndex: number; visible: boolean };
  timetable: Timetable;
  timetableTheme: TimetableThemeName;
  termId: string;
  onRemove: (moduleCode: ModuleCode) => void;
  onToggleVisibility: (moduleCode: ModuleCode) => void;
  onColorChange: (moduleCode: ModuleCode, colorIndex: number) => void;
}

export function ModuleCard({
  module: mod,
  timetable,
  timetableTheme,
  onRemove,
  onToggleVisibility,
  onColorChange,
}: ModuleCardProps) {
  return (
    <div className="bg-background flex w-full rounded-sm border p-4">
      <div className="w-fit">
        <Popover>
          <PopoverTrigger asChild>
            <div
              className="mt-1 mr-2 h-5 w-5 cursor-pointer rounded"
              style={{
                backgroundColor:
                  TIMETABLE_THEMES[timetableTheme][mod.colorIndex]
                    ?.backgroundColor,
              }}
            ></div>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="grid w-28 grid-cols-3 items-center justify-center gap-2">
              {TIMETABLE_THEMES[timetableTheme].map((color, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: color.backgroundColor }}
                  className="size-8 cursor-pointer rounded"
                  onClick={() => onColorChange(mod.moduleCode, index)}
                ></div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-grow">
        <ModuleDetails moduleCode={mod.moduleCode}>
          <p className="cursor-pointer text-sm font-bold hover:underline">
            {mod.moduleCode} - {mod.name}
          </p>
        </ModuleDetails>
        {(() => {
          const section = getSectionFromTimetable(
            timetable,
            mod.moduleCode,
            mod,
          );
          if (section) {
            return (
              <BidAnalyticsPopover
                moduleCode={mod.moduleCode}
                instructor={section.professor.name}
              >
                <div className="cursor-pointer text-sm hover:underline">
                  <p>
                    {section.professor.name} - {section.code}
                  </p>
                  <p>
                    {section.location.building} {section.location.room}
                  </p>
                </div>
              </BidAnalyticsPopover>
            );
          }
          return null;
        })()}
        <p className="text-sm">
          Exam:{" "}
          {mod.exam?.dateTime
            ? format(new Date(mod.exam.dateTime), "MMM dd, yyyy h:mm a")
            : "No exam scheduled"}
        </p>
      </div>
      <div className="w-fit content-center">
        <div className="flex flex-row">
          <Button
            variant="outline"
            size="icon"
            className="rounded-r-none"
            onClick={() => onRemove(mod.moduleCode)}
          >
            <Trash2 />
          </Button>
          <Button
            variant={mod.visible ? "default" : "outline"}
            size="icon"
            className="rounded-l-none border-l-0"
            onClick={() => onToggleVisibility(mod.moduleCode)}
          >
            {mod.visible ? <Eye /> : <EyeOff />}
          </Button>
        </div>
      </div>
    </div>
  );
}
