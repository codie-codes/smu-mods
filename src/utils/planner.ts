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
import type {
  Module,
  ModuleCode,
  ModuleForPlanner,
} from "@/types/primitives/module";
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
    const temp = moduleCodeMap[moduleCode];
    if (!temp) return null;
    if (!temp.terms || temp.terms.length < 1) return null;
    if (!temp.terms.includes(term)) {
      return { type: "term", termsOffered: temp.terms };
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
  plannerModules: PlannerState["modules"],
  fullModules: Module[],
): ConflictMap[ModuleCode] {
  const moduleBank = getModuleBankFromPlannerState(plannerModules);

  const modulesTaken = calculatePreviousModulesTaken(
    plannerModules,
    plannerModule,
  );
  const conflicts = [
    prereqConflict(moduleBank, modulesTaken)(plannerModule.module.moduleCode),
    semesterConflict(
      moduleBank,
      plannerModule.term,
    )(plannerModule.module.moduleCode),
    examConflict(findExamClashes(fullModules))(plannerModule.module.moduleCode),
  ].filter((conflict) => conflict !== null);
  return {
    conflicts: conflicts,
  };
}

export function getPlanner(plannerModules: PlannerState["modules"]): Planner {
  const planner: Planner = defaultPlanner;

  const moduleBank = getModuleBankFromPlannerState(plannerModules);

  const fullModules = Object.keys(plannerModules).map(
    (moduleCode) => moduleBank[moduleCode as ModuleCode],
  ) as Module[];

  for (const moduleCode in plannerModules) {
    const plannerModule = plannerModules[moduleCode as ModuleCode];
    if (!plannerModule) {
      continue;
    }

    planner[plannerModule.year][plannerModule.term][moduleCode as ModuleCode] =
      getPlannerModuleInfo(plannerModule, plannerModules, fullModules);
  }
  return planner;
}

export function getPlannerModule(
  moduleCode: ModuleCode,
  moduleBank: ModuleBank,
): ModuleForPlanner {
  const { sections, exam, ...module } = moduleBank[moduleCode];
  return module;
}

export function getModuleBankFromPlannerState(
  plannerStateModules: PlannerState["modules"],
): ModuleBank {
  return Object.fromEntries(
    Object.entries(plannerStateModules).map(([moduleCode, module]) => [
      moduleCode,
      module.module,
    ]),
  ) as ModuleBank;
}
