import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ModuleBank } from "@/types/banks/moduleBank";
import type { Planner, PlannerState, Term, Year } from "@/types/planner";
import type { ModuleCode } from "@/types/primitives/module";
import { defaultPlanner, defaultPlannerState } from "@/types/planner";
import { getPlanner, getPlannerModule } from "@/utils/planner";

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
  update: (moduleBank?: ModuleBank) => void;
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
        update: (moduleBank?: ModuleBank) => {
          if (!moduleBank) return;

          set((state) => {
            const updatedPlanners = { ...state.planners };
            let hasAnyChanges = false;

            for (const [plannerId, planner] of Object.entries(
              updatedPlanners,
            )) {
              const updatedModules = { ...planner.plannerState.modules };
              let hasChanges = false;

              for (const [moduleCode, plannerModule] of Object.entries(
                updatedModules,
              )) {
                // Check if this is old format (has moduleCode but no module property)
                const plannerModuleAny = plannerModule as any;
                if (plannerModuleAny.moduleCode && !plannerModuleAny.module) {
                  // Migrate to new format
                  const { moduleCode: _, ...moduleWithoutCode } =
                    plannerModuleAny;
                  (updatedModules as any)[moduleCode] = {
                    ...moduleWithoutCode,
                    module: getPlannerModule(
                      plannerModuleAny.moduleCode,
                      moduleBank,
                    ),
                  };
                  hasChanges = true;
                  hasAnyChanges = true;
                }
              }

              if (hasChanges) {
                updatedPlanners[plannerId] = {
                  ...planner,
                  plannerState: {
                    ...planner.plannerState,
                    modules: updatedModules,
                  },
                  planner: getPlanner(updatedModules),
                };
              }
            }

            return hasAnyChanges ? { planners: updatedPlanners } : state;
          });
        },
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
                module: getPlannerModule(moduleCode, moduleBank),
              },
            },
          };

          set((state) => ({
            planners: {
              ...state.planners,
              [plannerId]: {
                ...original,
                plannerState: newPlannerState,
                planner: getPlanner(newPlannerState.modules),
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
          plannerId,
        ) => {
          const original = get().planners[plannerId];
          if (!original) return;

          const temp = original.plannerState.modules[moduleCode];
          if (!temp) return;

          set((state) => {
            const planner = state.planners[plannerId];
            if (!planner) {
              return state;
            }
            const updatedModule = {
              ...temp,
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
              planner: getPlanner(newPlannerState.modules),
              plannerState: newPlannerState,
              isSpecialHidden: planner.isSpecialHidden,
            };

            delete stateTemp.planner[srcYear][srcTerm][moduleCode];

            return { planners: { ...state.planners, [plannerId]: stateTemp } };
          });
        },
        removeModule: (moduleCode, year, term, plannerId) => {
          const planner = get().planners[plannerId];
          if (!planner) return;
          const original = planner.plannerState;
          const tempModule = original.modules[moduleCode];

          if (!tempModule) return;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [moduleCode]: _, ...remainingModules } = original.modules;

          const temp = {
            name: planner.name,
            plannerState: {
              ...original,
              modules: remainingModules,
            },
            planner: getPlanner(planner.plannerState.modules),
            isSpecialHidden: planner.isSpecialHidden,
          };
          delete temp.planner[year][term][moduleCode];

          set((state) => ({
            planners: {
              ...state.planners,
              [plannerId]: {
                ...temp,
                plannerState: temp.plannerState,
                planner: getPlanner(temp.plannerState.modules),
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
