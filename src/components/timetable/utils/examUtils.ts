import type { Module } from "@/types/primitives/module";

export type ModuleWithExam = Omit<Module, "exam"> & {
  exam: NonNullable<Module["exam"]>;
};

export function findExamConflicts(
  modulesWithExams: ModuleWithExam[],
): Map<string, string[]> {
  const conflictingModules = new Map<string, string[]>();

  if (modulesWithExams.length < 2) {
    return conflictingModules;
  }

  // Assuming modulesWithExams is sorted by exam start time.
  for (let i = 0; i < modulesWithExams.length; i++) {
    const moduleA = modulesWithExams[i];
    const startA = new Date(moduleA.exam.dateTime);
    const endA = new Date(
      startA.getTime() + moduleA.exam.durationInHour * 60 * 60 * 1000,
    );

    for (let j = i + 1; j < modulesWithExams.length; j++) {
      const moduleB = modulesWithExams[j];
      const startB = new Date(moduleB.exam.dateTime);

      // Check for overlap
      if (startB < endA) {
        const conflictsForA = conflictingModules.get(moduleA.moduleCode) || [];
        if (!conflictsForA.includes(moduleB.moduleCode)) {
          conflictsForA.push(moduleB.moduleCode);
        }
        conflictingModules.set(moduleA.moduleCode, conflictsForA);

        const conflictsForB = conflictingModules.get(moduleB.moduleCode) || [];
        if (!conflictsForB.includes(moduleA.moduleCode)) {
          conflictsForB.push(moduleA.moduleCode);
        }
        conflictingModules.set(moduleB.moduleCode, conflictsForB);
      }
    }
  }

  return conflictingModules;
} 