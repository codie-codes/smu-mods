import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";

import type { Module } from "@/types/primitives/module";
import type { TimetableThemeName } from "@/utils/timetable/colours";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TIMETABLE_THEMES } from "@/utils/timetable/colours";

import type { ModuleWithExam } from "../utils/examUtils";
import { findExamConflicts } from "../utils/examUtils";

interface ExamTableProps {
  modules: (Module & { colorIndex: number; visible: boolean })[];
  timetableTheme: TimetableThemeName;
}

export function ExamTable({ modules, timetableTheme }: ExamTableProps) {
  // Filter modules that have exams and sort by date
  const modulesWithExams = modules
    .filter(
      (mod): mod is ModuleWithExam & typeof mod =>
        !!mod.exam?.dateTime && mod.visible,
    )
    .sort((a, b) => {
      const dateA = new Date(a.exam.dateTime);
      const dateB = new Date(b.exam.dateTime);
      return dateA.getTime() - dateB.getTime();
    });

  const conflictingModules = findExamConflicts(modulesWithExams);

  const moduleCodeToNameMap = new Map<string, string>(
    modulesWithExams.map((mod) => [mod.moduleCode, mod.name]),
  );

  if (modulesWithExams.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No exams scheduled for your modules
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="border-accent-foreground/20 w-full rounded-lg border p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module Code</TableHead>
              <TableHead>Module Name</TableHead>
              <TableHead>Exam Date & Time</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modulesWithExams.map((mod) => {
              const conflicts = conflictingModules.get(mod.moduleCode);
              const isConflicting = !!conflicts;

              return (
                <TableRow
                  key={mod.moduleCode}
                  className={cn(isConflicting && "bg-destructive/10")}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded"
                        style={{
                          backgroundColor:
                            TIMETABLE_THEMES[timetableTheme][mod.colorIndex]
                              ?.backgroundColor,
                        }}
                      />
                      <span className="font-medium">{mod.moduleCode}</span>
                      {isConflicting && (
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="text-destructive h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Clashes with:{" "}
                              {conflicts
                                ?.map((code) => moduleCodeToNameMap.get(code))
                                .join(", ")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{mod.name}</TableCell>
                  <TableCell>
                    {format(
                      new Date(mod.exam.dateTime),
                      "MMM dd, yyyy 'at' h:mm a",
                    )}
                  </TableCell>
                  <TableCell>
                    {mod.exam.durationInHour} hour
                    {mod.exam.durationInHour !== 1 ? "s" : ""}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
