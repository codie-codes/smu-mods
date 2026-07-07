import { ModuleBank } from "@/types/banks/moduleBank";
import { terms } from "@/types/planner";
import { loadModulesFromBackup } from "../data/moduleBank";

export function getModuleJson(): ModuleBank {
  try {
    const modules = loadModulesFromBackup();

    // Normalize: ensure all modules have required properties
    Object.values(modules).forEach((module) => {
      // If terms is missing, default to all terms
      if (!module.terms || !Array.isArray(module.terms)) {
        module.terms = [...terms];
      }
      // Ensure sections exists
      if (!module.sections) {
        module.sections = [];
      }
    });

    return modules;
  } catch (error) {
    console.error("Error loading modules:", error);
    throw error;
  }
}
