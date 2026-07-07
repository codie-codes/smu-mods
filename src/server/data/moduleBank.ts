import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

import type { ModuleBank } from "@/types/banks/moduleBank";
import type { Module } from "@/types/primitives/module";

function collectJsonFiles(directoryPath: string): string[] {
  const entries = readdirSync(directoryPath, { withFileTypes: true }).sort(
    (left, right) => left.name.localeCompare(right.name),
  );

  return entries.flatMap((entry) => {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return collectJsonFiles(entryPath);
    }

    if (entry.isFile() && entry.name.endsWith(".json")) {
      return [entryPath];
    }

    return [];
  });
}

function normalizeModules(parsedValue: unknown): Module[] {
  if (Array.isArray(parsedValue)) {
    return parsedValue as Module[];
  }

  if (
    parsedValue !== null &&
    typeof parsedValue === "object" &&
    "moduleCode" in parsedValue
  ) {
    return [parsedValue as Module];
  }

  return [];
}

export function loadModulesFromBackup(): ModuleBank {
  const backupDirectory = path.join(process.cwd(), "backup");

  if (!existsSync(backupDirectory)) {
    throw new Error(
      "Missing backup directory. Place the scraper export at the repository root as ./backup.",
    );
  }

  const modulesByCode: Record<string, Module> = {};

  for (const filePath of collectJsonFiles(backupDirectory)) {
    const fileContents = readFileSync(filePath, "utf8");
    const parsedValue = JSON.parse(fileContents) as unknown;

    for (const module of normalizeModules(parsedValue)) {
      if (module.moduleCode) {
        modulesByCode[module.moduleCode] = module;
      }
    }
  }

  return modulesByCode as ModuleBank;
}
