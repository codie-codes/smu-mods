import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ModuleBank } from "@/types/banks/moduleBank";
import type { Planner, PlannerState, Term, Year } from "@/types/planner";
import type { ModuleCode } from "@/types/primitives/module";
import { Logger } from "@/utils/Logger";

import {
  addModule,
  addPlanner,
  changePlannerName,
  changeTerm,
  hideSpecial,
  removeModule,
  removePlanner,
  update,
} from "./functions";

export type MultiplePlannerActions = {
  addModule: (
    moduleCode: ModuleCode,
    attributes: {
      id: string;
      year: Year;
      term: Term;
    },
    moduleBank: ModuleBank,
    plannerId: string,
  ) => void;
  changeTerm: (
    srcYear: Year,
    srcTerm: Term,
    destYear: Year,
    destTerm: Term,
    moduleCode: ModuleCode,
    plannerId: string,
  ) => void;
  removeModule: (
    moduleCode: ModuleCode,
    year: Year,
    term: Term,
    plannerId: string,
  ) => void;
  hideSpecial: (year: Year, plannerId: string) => void;
  iSync: (planners: MultiplePlanner) => void;
  changePlannerName: (plannerId: string, name: string) => void;
  removePlanner: (plannerId: string) => void;
  addPlanner: (name: string, plannerFull?: Omit<PlannerFull, "name">) => void;
  update: (moduleBank: ModuleBank) => void;
};

export type PlannerFull = {
  name: string;
  plannerState: PlannerState;
  planner: Planner;
  isSpecialHidden: Record<Year, boolean>;
};

export type MultiplePlanner = Record<string, PlannerFull>;

const defaultPlanners: MultiplePlanner = {};

export type MultiplePlannerStore = {
  planners: MultiplePlanner;
} & MultiplePlannerActions;

export const createMultiplePlannerBank = (
  initPlanners: MultiplePlanner = defaultPlanners,
) => {
  return create<MultiplePlannerStore>()(
    persist(
      (set) => ({
        planners: initPlanners,
        update: (moduleBank: ModuleBank) => {
          set((state) => {
            const temp = update(state.planners, moduleBank);
            Logger.log("update", temp);
            return { planners: temp };
          });
        },
        addModule: (moduleCode, attributes, moduleBank, plannerId) => {
          set((state) => {
            const temp = addModule(
              state.planners,
              moduleCode,
              attributes,
              moduleBank,
              plannerId,
            );
            Logger.log("addModule", temp);
            return { planners: temp };
          });
        },
        changeTerm: (
          srcYear,
          srcTerm,
          destYear,
          destTerm,
          moduleCode,
          plannerId,
        ) => {
          set((state) => {
            const temp = changeTerm(
              state.planners,
              srcYear,
              srcTerm,
              destYear,
              destTerm,
              moduleCode,
              plannerId,
            );
            Logger.log("changeTerm", temp);
            return { planners: temp };
          });
        },
        removeModule: (moduleCode, year, term, plannerId) => {
          set((state) => {
            const temp = removeModule(
              state.planners,
              moduleCode,
              year,
              term,
              plannerId,
            );
            Logger.log("removeModule", temp);
            return { planners: temp };
          });
        },
        hideSpecial: (year: Year, plannerId) => {
          set((state) => {
            const temp = hideSpecial(state.planners, year, plannerId);
            Logger.log("hideSpecial", temp);
            return { planners: temp };
          });
        },
        changePlannerName: (plannerId, name) => {
          set((state) => {
            const temp = changePlannerName(state.planners, plannerId, name);
            Logger.log("changePlannerName", temp);
            return { planners: temp };
          });
        },
        removePlanner: (plannerId) => {
          set((state) => {
            const temp = removePlanner(state.planners, plannerId);
            Logger.log("removePlanner", temp);
            return { planners: temp };
          });
        },
        iSync: (planners) => {
          set({
            planners,
          });
        },
        addPlanner: (name, plannerFull) => {
          set((state) => {
            const temp = addPlanner(state.planners, name, plannerFull);
            Logger.log("addPlanner", temp);
            return { planners: temp };
          });
        },
      }),
      {
        name: "multiplePlanners",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
};
