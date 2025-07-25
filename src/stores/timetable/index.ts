import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Term } from "@/types/planner";
import type { Module, ModuleCode, Section } from "@/types/primitives/module";
import type { Timetable, TimetableMap } from "@/types/primitives/timetable";
import type { TimetableThemeName } from "@/utils/timetable/colours";
import { APP_CONFIG } from "@/config";
import { termMap } from "@/types/planner";
import { defaultTimetableMap } from "@/types/primitives/timetable";
import {
  addModuleToTimetable,
  changeColorOfModule,
  selectSection,
  showAllSections,
  toggleVisibility,
} from "@/utils/timetable/timetable";

export type TimetableActions = {
  AddModuleToTimetable: (
    module: Module,
    term: Term,
    theme: TimetableThemeName,
  ) => Promise<void>;
  removeModuleFromTimetable: (moduleCode: ModuleCode, term: Term) => void;
  selectSection: (
    moduleCode: ModuleCode,
    sectionCode: string,
    term: Term,
  ) => void;
  showAllSections: (
    moduleCode: ModuleCode,
    term: Term,
    theme: TimetableThemeName,
    currentSectionCode?: Section["code"],
  ) => void;
  toggleVisibility: (moduleCode: ModuleCode, term: Term) => void;
  iSync: (data: TimetableMap) => void;
  changeColorOfModule: (
    term: Term,
    moduleCode: ModuleCode,
    colorIndex: number,
  ) => void;
};

export type TimetableStore = {
  timetableMap: TimetableMap;
} & TimetableActions;

export const createTimetableStore = (
  initTimetableMap: TimetableMap = defaultTimetableMap,
) => {
  return create<TimetableStore>()(
    persist(
      (set, get) => ({
        timetableMap: initTimetableMap,
        toggleVisibility: (moduleCode: ModuleCode, term: Term) => {
          const timetable = get().timetableMap[term];
          const newTimeTable = toggleVisibility(moduleCode, timetable);
          set((state) => ({
            ...state,
            timetableMap: { ...state.timetableMap, [term]: newTimeTable },
          }));
        },
        changeColorOfModule: (term, moduleCode, colorIndex) => {
          const timetable = get().timetableMap[term];
          const newTimeTable = changeColorOfModule(
            moduleCode,
            timetable,
            colorIndex,
          );
          set((state) => ({
            ...state,
            timetableMap: { ...state.timetableMap, [term]: newTimeTable },
          }));
        },
        AddModuleToTimetable: async (
          module: Module,
          term: Term,
          theme: TimetableThemeName,
        ) => {
          const timetable = get().timetableMap[term];
          if (term !== termMap[APP_CONFIG.currentTerm]) {
            toast.error("You can only add modules to the current term");
            return;
          }
          const newTimeTable = addModuleToTimetable(
            module,
            timetable,
            theme,
            term,
          );
          set((state) => ({
            ...state,
            timetableMap: { ...state.timetableMap, [term]: newTimeTable },
          }));
        },
        removeModuleFromTimetable: (moduleCode: ModuleCode, term: Term) => {
          const tempModule = get().timetableMap[term].modules.find(
            (m) => m.moduleCode === moduleCode,
          );
          if (!tempModule) {
            toast.error("Module not found");
            return;
          }
          const timetable = get().timetableMap[term];
          const updatedTimetable = JSON.parse(
            JSON.stringify(timetable),
          ) as Timetable;
          tempModule.sections.forEach((section) => {
            section.classes.forEach((classTime) => {
              updatedTimetable[classTime.day] = updatedTimetable[
                classTime.day
              ].filter((c) => c.moduleCode !== moduleCode);
            });
          });
          updatedTimetable.modules = updatedTimetable.modules.filter(
            (mod) => mod.moduleCode !== moduleCode,
          );
          set((state) => ({
            ...state,
            timetableMap: {
              ...state.timetableMap,
              [term]: updatedTimetable,
            },
          }));
        },
        showAllSections: (
          moduleCode: ModuleCode,
          term: Term,
          theme: TimetableThemeName,
          currentSectionCode?: Section["code"],
        ) => {
          const tempModule = get().timetableMap[term].modules.find(
            (m) => m.moduleCode === moduleCode,
          );
          if (!tempModule) {
            toast.error("Module not found");
            return;
          }
          const timetable = get().timetableMap[term];
          const newTimeTable = showAllSections(
            tempModule,
            timetable,
            theme,
            currentSectionCode,
          );
          set((state) => ({
            ...state,
            timetableMap: {
              ...state.timetableMap,
              [term]: newTimeTable,
            },
          }));
        },
        selectSection: (
          moduleCode: ModuleCode,
          sectionCode: string,
          term: Term,
        ) => {
          const tempModule = get().timetableMap[term].modules.find(
            (m) => m.moduleCode === moduleCode,
          );
          if (!tempModule) {
            toast.error("Module not found");
            return;
          }
          const timetable = get().timetableMap[term];
          const newTimeTable = selectSection(
            tempModule,
            timetable,
            sectionCode,
          );
          set((state) => ({
            ...state,
            timetableMap: {
              ...state.timetableMap,
              [term]: newTimeTable,
            },
          }));
        },
        iSync: (data: TimetableMap) => {
          set((state) => ({
            ...state,
            timetableMap: data,
          }));
        },
      }),
      {
        name: "timetable",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
};
