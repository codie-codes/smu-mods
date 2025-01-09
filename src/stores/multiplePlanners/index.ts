import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ModuleBank } from "@/types/banks/moduleBank";
import type { Planner, PlannerState, Term, Year } from "@/types/planner";
import type { ModuleCode } from "@/types/primitives/module";
import { defaultPlanner, defaultPlannerState } from "@/types/planner";
import { getPlanner } from "@/utils/planner";

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
    moduleBank: ModuleBank,
    plannerId: string,
  ) => void;
  removeModule: (
    moduleCode: ModuleCode,
    year: Year,
    term: Term,
    moduleBank: ModuleBank,
    plannerId: string,
  ) => void;
  hideSpecial: (year: Year, plannerId: string) => void;
  iSync: (planners: MultiplePlanner) => void;
  changePlannerName: (plannerId: string, name: string) => void;
  removePlanner: (plannerId: string) => void;
  addPlanner: (name: string, plannerFull?: Omit<PlannerFull, "name">) => void;
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
      (set, get) => ({
        planners: initPlanners,
        addModule: (moduleCode, attributes, moduleBank, plannerId) => {
          const original = get().planners[plannerId];
          if (!original) return;
          if (original.plannerState.modules[moduleCode]) return;
          const newPlannerState: PlannerState = {
            ...original.plannerState,
            modules: {
              ...original.plannerState.modules,
              [moduleCode]: {
                year: attributes.year,
                term: attributes.term,
                moduleCode,
              },
            },
          };

          set((state) => ({
            planners: {
              ...state.planners,
              [plannerId]: {
                ...original,
                plannerState: newPlannerState,
                planner: getPlanner(newPlannerState.modules, moduleBank),
              },
            },
          }));
        },
        changeTerm: (
          srcYear,
          srcTerm,
          destYear,
          destTerm,
          moduleCode,
          moduleBank,
          plannerId,
        ) => {
          const original = get().planners[plannerId];
          if (!original) return;

          const module = original.plannerState.modules[moduleCode];
          if (!module) return;

          set((state) => {
            const planner = state.planners[plannerId];
            if (!planner) {
              return state;
            }
            const updatedModule = {
              ...module,
              year: destYear,
              term: destTerm,
            };

            const newPlannerState: PlannerState = {
              ...planner.plannerState,
              modules: {
                ...planner.plannerState.modules,
                [moduleCode]: updatedModule,
              },
            };

            const stateTemp = {
              name: planner.name,
              planner: getPlanner(newPlannerState.modules, moduleBank),
              plannerState: newPlannerState,
              isSpecialHidden: planner.isSpecialHidden,
            };

            delete stateTemp.planner[srcYear][srcTerm][moduleCode];

            return { planners: { ...state.planners, [plannerId]: stateTemp } };
          });
        },
        removeModule: (moduleCode, year, term, moduleBank, plannerId) => {
          const planner = get().planners[plannerId];
          if (!planner) return;
          const original = planner.plannerState;
          const module = original.modules[moduleCode];

          if (!module) return;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [moduleCode]: _, ...remainingModules } = original.modules;

          const temp = {
            name: planner.name,
            plannerState: {
              ...original,
              modules: remainingModules,
            },
            planner: getPlanner(planner.plannerState.modules, moduleBank),
            isSpecialHidden: planner.isSpecialHidden,
          };
          delete temp.planner[year][term][moduleCode];

          set((state) => ({
            planners: {
              ...state.planners,
              [plannerId]: {
                ...temp,
                plannerState: temp.plannerState,
                planner: getPlanner(temp.plannerState.modules, moduleBank),
              },
            },
          }));
        },
        hideSpecial: (year: Year, plannerId) => {
          set((state) => {
            const planner = state.planners[plannerId];
            if (!planner) {
              return state;
            }
            const currentHiddenState = planner.isSpecialHidden[year];
            return {
              planners: {
                ...state.planners,
                [plannerId]: {
                  ...planner,
                  isSpecialHidden: {
                    ...planner.isSpecialHidden,
                    [year]: !currentHiddenState,
                  },
                },
              },
            };
          });
        },
        changePlannerName: (plannerId, name) => {
          set((state) => {
            const planner = state.planners[plannerId];
            if (!planner) {
              return state;
            }
            return {
              planners: {
                ...state.planners,
                [plannerId]: {
                  ...planner,
                  name,
                },
              },
            };
          });
        },
        removePlanner: (plannerId) => {
          set((state) => {
            const { [plannerId]: _, ...remainingPlanners } = state.planners;
            return {
              planners: remainingPlanners,
            };
          });
        },
        iSync: (planners) => {
          set({
            planners,
          });
        },
        addPlanner: (name, plannerFull) => {
          const state = get();
          console.log(state);
          set(() => {
            const newPlannerId = `planner${Object.keys(state.planners).length}`;
            if (plannerFull) {
              return {
                planners: {
                  ...state.planners,
                  [newPlannerId]: {
                    ...plannerFull,
                    name,
                  },
                },
              };
            }
            return {
              planners: {
                ...state.planners,
                [newPlannerId]: {
                  name,
                  planner: defaultPlanner,
                  plannerState: defaultPlannerState,
                  isSpecialHidden: {
                    1: true,
                    2: true,
                    3: true,
                    4: true,
                  },
                },
              },
            };
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

export const removeModulesFromPlannerState = (
  modules: PlannerState["modules"],
  predicate: (moduleCode: string, module: any) => boolean,
) => {
  return Object.fromEntries(
    Object.entries(modules).filter(
      ([moduleCode, module]) => !predicate(moduleCode, module),
    ),
  );
};
