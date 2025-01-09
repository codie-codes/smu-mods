import { get, groupBy, values } from "lodash";

import type { ModuleBank } from "@/types/banks/moduleBank";
import type {
  Conflict,
  ConflictMap,
  ExamClashes,
  Planner,
  PlannerModule,
  PlannerState,
  Term,
} from "@/types/planner";
import type { Module, ModuleCode } from "@/types/primitives/module";
import { defaultPlanner, terms } from "@/types/planner";

import { checkPrerequisite } from "./checkPrerequisites";

export const prereqConflict =
  (modulesMap: ModuleBank, modulesTaken: Set<ModuleCode>) =>
  (moduleCode: ModuleCode): Conflict | null => {
    const prereqs = get(modulesMap, [moduleCode, "preReq"]);
    if (!prereqs) return null;

    const status = checkPrerequisite(modulesTaken, prereqs);
    if (status.fulfilled) return null;

    return { type: "prereq", statusNode: status.status };
  };

export const semesterConflict =
  (moduleCodeMap: ModuleBank, term: Term) =>
  (moduleCode: ModuleCode): Conflict | null => {
    const module = moduleCodeMap[moduleCode];
    if (!module) return null;
    if (!module.terms || module.terms.length < 1) return null;
    if (!module.terms.includes(term)) {
      return { type: "term", termsOffered: module.terms };
    }

    return null;
  };

export const examConflict =
  (clashes: ExamClashes) =>
  (moduleCode: ModuleCode): Conflict | null => {
    const clash = values(clashes).find((modules) =>
      Boolean(modules.find((module) => module.moduleCode === moduleCode)),
    );

    if (clash) {
      return {
        type: "exam",
        conflictModules: clash.map((module) => module.moduleCode),
      };
    }

    return null;
  };

const isTermBefore = (termA: Term, termB: Term): boolean => {
  return terms.indexOf(termA) < terms.indexOf(termB);
};

export const calculatePreviousModulesTaken = (
  plannerModules: Record<ModuleCode, PlannerModule>,
  targetModule: PlannerModule,
): Set<ModuleCode> => {
  const modulesTaken = new Set<ModuleCode>();

  for (const moduleCode in plannerModules) {
    const currentModule = plannerModules[moduleCode as ModuleCode];

    if (!currentModule) {
      continue;
    }
    // Check if the current module is before the target module
    if (
      currentModule.year < targetModule.year ||
      (currentModule.year === targetModule.year &&
        isTermBefore(currentModule.term, targetModule.term))
    ) {
      modulesTaken.add(moduleCode as ModuleCode);
    }
  }

  return modulesTaken;
};

export function findExamClashes(modules: Module[]): ExamClashes {
  const grouped = groupBy(modules, (module) => module.exam?.dateTime);

  const clashes: ExamClashes = {};

  for (const key in grouped) {
    const group = grouped[key];
    if (!group) continue;
    if (group.length > 1) {
      group.forEach((module) => {
        if (!clashes[module.moduleCode]) {
          clashes[module.moduleCode] = [];
        }

        clashes[module.moduleCode]!.push(module);
      });
    }
  }

  return clashes;
}

export function getPlannerModuleInfo(
  plannerModule: PlannerModule,
  moduleBank: ModuleBank,
  plannerModules: PlannerState["modules"],
  fullModules: Module[],
): ConflictMap[ModuleCode] {
  const modulesTaken = calculatePreviousModulesTaken(
    plannerModules,
    plannerModule,
  );
  const conflicts = [
    prereqConflict(moduleBank, modulesTaken)(plannerModule.moduleCode),
    semesterConflict(moduleBank, plannerModule.term)(plannerModule.moduleCode),
    examConflict(findExamClashes(fullModules))(plannerModule.moduleCode),
  ].filter((conflict) => conflict !== null);
  return {
    conflicts: conflicts,
  };
}

export function getPlanner(
  plannerModules: PlannerState["modules"],
  moduleBank: ModuleBank,
): Planner {
  const planner: Planner = defaultPlanner;

  const fullModules = Object.keys(plannerModules).map(
    (moduleCode) => moduleBank[moduleCode as ModuleCode],
  ) as Module[];

  for (const moduleCode in plannerModules) {
    const plannerModule = plannerModules[moduleCode as ModuleCode];
    if (!plannerModule) {
      continue;
    }

    planner[plannerModule.year][plannerModule.term][moduleCode as ModuleCode] =
      getPlannerModuleInfo(
        plannerModule,
        moduleBank,
        plannerModules,
        fullModules,
      );
  }
  return planner;
}
