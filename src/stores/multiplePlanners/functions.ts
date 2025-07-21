import { ModuleBank } from "@/types/banks/moduleBank";
import {
  defaultPlanner,
  defaultPlannerState,
  PlannerState,
  Term,
  Year,
} from "@/types/planner";
import { ModuleCode } from "@/types/primitives/module";
import { getPlanner, getPlannerModule } from "@/utils/planner";

import { MultiplePlanner, PlannerFull } from ".";

export function update(planners: MultiplePlanner, moduleBank: ModuleBank) {
  const updatedPlanners = { ...planners };
  let hasAnyChanges = false;

  for (const [plannerId, planner] of Object.entries(updatedPlanners)) {
    const updatedModules = { ...planner.plannerState.modules };
    let hasChanges = false;

    for (const [moduleCode, plannerModule] of Object.entries(updatedModules)) {
      const plannerModuleAny = plannerModule as any;
      if (plannerModuleAny.moduleCode && !plannerModuleAny.module) {
        const { moduleCode: _, ...moduleWithoutCode } = plannerModuleAny;
        (updatedModules as any)[moduleCode] = {
          ...moduleWithoutCode,
          module: getPlannerModule(plannerModuleAny.moduleCode, moduleBank),
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

  return hasAnyChanges ? updatedPlanners : planners;
}

export function addModule(
  planners: MultiplePlanner,
  moduleCode: ModuleCode,
  attributes: {
    id: string;
    year: Year;
    term: Term;
  },
  moduleBank: ModuleBank,
  plannerId: string,
): MultiplePlanner {
  const original = { ...planners[plannerId] };
  if (!original) return planners;
  if (original.plannerState.modules[moduleCode]) return planners;
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
  return {
    ...planners,
    [plannerId]: {
      ...original,
      plannerState: newPlannerState,
      planner: getPlanner(newPlannerState.modules),
    },
  };
}

export function changeTerm(
  planners: MultiplePlanner,
  srcYear: Year,
  srcTerm: Term,
  destYear: Year,
  destTerm: Term,
  moduleCode: ModuleCode,
  plannerId: string,
): MultiplePlanner {
  const original = { ...planners[plannerId] };
  if (!original) return planners;
  const temp = original.plannerState.modules[moduleCode];
  if (!temp) return planners;
  const updatedModule = {
    ...temp,
    year: destYear,
    term: destTerm,
  };
  const newPlannerState: PlannerState = {
    ...original.plannerState,
    modules: {
      ...original.plannerState.modules,
      [moduleCode]: updatedModule,
    },
  };
  const stateTemp = {
    name: original.name,
    planner: getPlanner(newPlannerState.modules),
    plannerState: newPlannerState,
    isSpecialHidden: original.isSpecialHidden,
  };

  delete stateTemp.planner[srcYear][srcTerm][moduleCode];

  return {
    ...planners,
    [plannerId]: stateTemp,
  };
}

export function removeModule(
  planners: MultiplePlanner,
  moduleCode: ModuleCode,
  year: Year,
  term: Term,
  plannerId: string,
): MultiplePlanner {
  const original = { ...planners[plannerId] };
  if (!original) return planners;
  const originalPlannerState = original.plannerState;
  const tempModule = originalPlannerState.modules[moduleCode];
  if (!tempModule) return planners;

  const { [moduleCode]: _, ...remainingModules } = originalPlannerState.modules;

  const temp = {
    name: original.name,
    plannerState: {
      ...originalPlannerState,
      modules: remainingModules,
    },
    planner: getPlanner(original.plannerState.modules),
    isSpecialHidden: original.isSpecialHidden,
  };

  delete temp.planner[year][term][moduleCode];

  return {
    ...planners,
    [plannerId]: {
      ...temp,
      plannerState: temp.plannerState,
      planner: getPlanner(temp.plannerState.modules),
    },
  };
}

export function hideSpecial(
  planners: MultiplePlanner,
  year: Year,
  plannerId: string,
): MultiplePlanner {
  const original = { ...planners[plannerId] };
  if (!original) return planners;
  const currentHiddenState = original.isSpecialHidden[year];
  return {
    ...planners,
    [plannerId]: {
      ...original,
      isSpecialHidden: {
        ...original.isSpecialHidden,
        [year]: !currentHiddenState,
      },
    },
  };
}

export function changePlannerName(
  planners: MultiplePlanner,
  plannerId: string,
  name: string,
): MultiplePlanner {
  const original = { ...planners[plannerId] };
  if (!original) return planners;
  return {
    ...planners,
    [plannerId]: {
      ...original,
      name,
    },
  };
}

export function removePlanner(
  planners: MultiplePlanner,
  plannerId: string,
): MultiplePlanner {
  const { [plannerId]: _, ...remainingPlanners } = planners;
  return remainingPlanners;
}

export function addPlanner(
  planners: MultiplePlanner,
  name: string,
  plannerFull?: Omit<PlannerFull, "name">,
): MultiplePlanner {
  const newPlannerId = `planner${Object.keys(planners).length}`;
  if (plannerFull) {
    return {
      ...planners,
      [newPlannerId]: {
        ...plannerFull,
        name,
      },
    };
  }
  return {
    ...planners,
    [newPlannerId]: {
      name,
      planner: defaultPlanner,
      plannerState: defaultPlannerState,
      isSpecialHidden: {
        1: false,
        2: false,
        3: false,
        4: false,
      },
    },
  };
}
