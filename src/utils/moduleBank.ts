import type { ModuleBank } from "@/types/banks/moduleBank";
import type { Module } from "@/types/primitives/module";

export function searchModule(modules: ModuleBank, query?: string): Module[] {
  if (!query) {
    return Object.values(modules);
  }
  return Object.values(modules).filter(
    (module) =>
      module.name.toLowerCase().includes(query.toLowerCase()) ||
      module.moduleCode.toLowerCase().includes(query.toLowerCase()),
  );
}
