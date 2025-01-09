import { type StatusNode } from "@/utils/checkPrerequisites";

import type { Module, ModuleCode } from "../primitives/module";

export type ExamConflict = {
  type: "exam";
  conflictModules: ModuleCode[];
};

export type TermConflict = {
  type: "term";
  termsOffered: readonly Term[];
};

export type PrereqConflict = {
  type: "prereq";
  statusNode?: StatusNode;
};

export type ExamClashes = Record<string, Module[]>;

export type Conflict = PrereqConflict | ExamConflict | TermConflict;

export type ConflictMap = Record<
  ModuleCode,
  {
    conflicts?: Conflict[];
  }
>;

export const EXEMPTION_YEAR = "-1";
export const MODSTOTAKE_YEAR = "10";
export const years = ["1", "2", "3", "4"] as const;

export type Year = (typeof years)[number];

export const EXEMPTION_TERM = "Term 0";
export const MODSTOTAKE_TERM = "Term Z";
export const terms = ["Term 1", "Term 2", "Term 3A", "Term 3B"] as const;
export type Term = (typeof terms)[number];
export const termSlug = ["term-1", "term-2", "term-3a", "term-3b"] as const;
export type TermSlug = (typeof termSlug)[number];

export const termMap: Record<TermSlug, Term> = {
  "term-1": "Term 1",
  "term-2": "Term 2",
  "term-3a": "Term 3A",
  "term-3b": "Term 3B",
};

export type PlannerModule = {
  year: Year;
  term: Term;

  moduleCode: ModuleCode;
};

export type PlannerState = {
  minYear: Year;
  maxYear: Year;

  modules: Record<ModuleCode, PlannerModule>;
};

export const defaultPlannerState: PlannerState = {
  minYear: "1",
  maxYear: "4",
  modules: {},
};

export type Planner = Record<Year, Record<Term, ConflictMap>> & {
  [MODSTOTAKE_YEAR]: {
    [MODSTOTAKE_TERM]: ConflictMap;
  };
} & {
  [EXEMPTION_YEAR]: {
    [EXEMPTION_TERM]: ConflictMap;
  };
};

export const defaultPlanner: Planner = {
  "-1": {
    "Term 0": {},
  },
  "1": {
    "Term 1": {},
    "Term 2": {},
    "Term 3A": {},
    "Term 3B": {},
  },
  "2": {
    "Term 1": {},
    "Term 2": {},
    "Term 3A": {},
    "Term 3B": {},
  },
  "3": {
    "Term 1": {},
    "Term 2": {},
    "Term 3A": {},
    "Term 3B": {},
  },
  "4": {
    "Term 1": {},
    "Term 2": {},
    "Term 3A": {},
    "Term 3B": {},
  },
  "10": {
    "Term Z": {},
  },
};
