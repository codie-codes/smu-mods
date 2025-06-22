"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { toast } from "sonner";

import type { TermSlug } from "@/types/planner";
import type { ModuleCode } from "@/types/primitives/module";
import { SearchModule } from "@/components/SearchModule";
import {
  ExamTable,
  ExportDropdown,
  ModuleList,
  TermNavigation,
  TimetableGrid,
} from "@/components/timetable/components";
import {
  exportAsPdfOrImage,
  exportClassesICal,
  exportExamsICal,
} from "@/components/timetable/utils/exportUtils";
import {
  calculateCurrentTimePosition,
  getCurrentDay,
} from "@/components/timetable/utils/timeUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_CONFIG, PADDING } from "@/config";
import { useConfigStore } from "@/stores/config/provider";
import { useTimetableStore } from "@/stores/timetable/provider";
import { termMap, termSlug } from "@/types/planner";

export default function TimeTablePage({
  params,
}: {
  params: Promise<{ termId: string }>;
}) {
  const resolvedParams = use(params);
  const {
    timetableMap,
    AddModuleToTimetable,
    toggleVisibility,
    removeModuleFromTimetable,
    showAllSections,
    selectSection,
    changeColorOfModule,
  } = useTimetableStore((state) => state);
  const { timetableTheme } = useConfigStore((state) => state);

  const [selectedClass, setSelectedSection] = useState<any>();
  const [hideCurrentTime, setHideCurrentTime] = useState(false);
  const [currentTimePosition, setCurrentTimePosition] = useState<number | null>(
    null,
  );

  const router = useRouter();
  const currentTermIdx = termSlug.indexOf(resolvedParams.termId as TermSlug);
  const currentTermNum = termSlug[currentTermIdx]?.split("-")[1];
  const timetable = timetableMap[termMap[resolvedParams.termId as TermSlug]];
  const elementRef = useRef<HTMLDivElement>(null);

  const addedMods = (): ModuleCode[] => {
    const addedModsList: ModuleCode[] = [];
    Object.keys(timetable).forEach((day) => {
      if (day !== "modules") {
        const dayMods = timetable[day as keyof typeof timetable];
        if (Array.isArray(dayMods) && dayMods.length > 0) {
          dayMods.forEach((mod: any) => {
            addedModsList.push(mod.moduleCode);
          });
        }
      }
    });
    return addedModsList;
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTimePosition(calculateCurrentTimePosition(15));
    };
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const goToPreviousTerm = () => {
    if (currentTermIdx > 0) {
      router.push(`${termSlug[currentTermIdx - 1]}`);
    }
  };

  const goToNextTerm = () => {
    if (currentTermIdx < termSlug.length - 1) {
      router.push(`${termSlug[currentTermIdx + 1]}`);
    }
  };

  const handleExportPdfOrImage = async (type: "png" | "pdf") => {
    setHideCurrentTime(true);
    const element = elementRef.current;
    if (!element) {
      return;
    }
    await exportAsPdfOrImage(element, type);
    setHideCurrentTime(false);
  };

  const handleClassClick = (fullClass: any) => {
    if (selectedClass && selectedClass.moduleCode && selectedClass.section) {
      if (selectedClass.moduleCode === fullClass.moduleCode) {
        selectSection(
          fullClass.moduleCode,
          fullClass.section,
          termMap[resolvedParams.termId as TermSlug],
        );
        setSelectedSection(undefined);
      } else {
        selectSection(
          selectedClass.moduleCode,
          selectedClass.section,
          termMap[resolvedParams.termId as TermSlug],
        );
        setSelectedSection(undefined);
      }
    } else {
      showAllSections(
        fullClass.moduleCode,
        termMap[resolvedParams.termId as TermSlug],
        timetableTheme,
        fullClass.section,
      );
      setSelectedSection(fullClass);
    }
  };

  if (!termSlug.includes(resolvedParams.termId as TermSlug)) {
    return (
      <div className="flex h-[90%] w-full flex-col items-center justify-center">
        <p className="text-7xl">404</p>
        <p className="font-semibold">Oops! This term doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: PADDING }} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Plan Your Timetable</h1>

      <TermNavigation
        currentTermNum={currentTermNum || ""}
        onPrevious={goToPreviousTerm}
        onNext={goToNextTerm}
        canGoPrevious={currentTermIdx > 0}
        canGoNext={currentTermIdx < termSlug.length - 1}
      />

      <SearchModule
        handleModSelect={(mod) => {
          if (mod.terms.includes(termMap[resolvedParams.termId as TermSlug])) {
            AddModuleToTimetable(
              mod,
              termMap[resolvedParams.termId as TermSlug],
              timetableTheme,
            );
          } else {
            toast.error("This module is not offered during this term.");
          }
        }}
        takenModule={addedMods()}
      />

      <Tabs defaultValue="timetable" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="timetable">Class Timetable</TabsTrigger>
          <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="timetable" className="space-y-4">
          <div ref={elementRef}>
            <TimetableGrid
              timetable={timetable}
              timetableTheme={timetableTheme}
              selectedClass={selectedClass}
              currentTimePosition={currentTimePosition}
              hideCurrentTime={hideCurrentTime}
              getCurrentDay={getCurrentDay}
              onClassClick={handleClassClick}
            />
          </div>

          <ExportDropdown
            disabled={!!selectedClass}
            isCurrentTerm={APP_CONFIG.currentTerm === resolvedParams.termId}
            onExportClassesICal={() => exportClassesICal(timetable)}
            onExportExamsICal={() => exportExamsICal(timetable)}
            onExportPDF={() => handleExportPdfOrImage("pdf")}
            onExportPNG={() => handleExportPdfOrImage("png")}
          />
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <ExamTable
            modules={timetable.modules}
            timetableTheme={timetableTheme}
          />
          <Button variant="outline" onClick={() => exportExamsICal(timetable)}>
            <Download className="mr-2 size-4" />
            Exams iCal
          </Button>
        </TabsContent>
      </Tabs>

      <ModuleList
        modules={timetable.modules}
        timetable={timetable}
        timetableTheme={timetableTheme}
        termId={resolvedParams.termId}
        onRemoveModule={(moduleCode, termId) =>
          removeModuleFromTimetable(moduleCode, termMap[termId as TermSlug])
        }
        onToggleVisibility={(moduleCode, termId) =>
          toggleVisibility(moduleCode, termMap[termId as TermSlug])
        }
        onColorChange={(termId, moduleCode, colorIndex) =>
          changeColorOfModule(
            termMap[termId as TermSlug],
            moduleCode,
            colorIndex,
          )
        }
      />
    </div>
  );
}
