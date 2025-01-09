import type { Track } from "./major";
import type { ModuleCode } from "./module";

export const baskets = [
  "Numeracy",
  "Modes Of Thinking",
  "Managing",
  "Writing and Reasoning",
  "Internship",
  "Economics and Society",
  "Technology, Science And Society",
  "Cultures Of The Modern World",
  "Community Service",
  "Ethics And Social/ Corporate Responsibility",
  "Big Questions",
  "Global Exposure",
  "Ethics And Social Responsibility",
  "IS Core- Technology Solutioning",
  "IS Core- Software Design And Development",
  "IS Core- Project Experience",
  "IS Elective",
  "Uni Core",
  "IS Product Development Electives",
  "IS Product Development Core",
] as const;

export type BasketType = (typeof baskets)[number];

export const basketCodes = [
  "ARTS",
  "ACCT",
  "ACM",
  "COMM",
  "COR",
  "COR-ACM",
  "COR-COMM",
  "COR-GA",
  "COR-INTS",
  "COR-IS",
  "COR-JPAN",
  "COR-KREA",
  "COR-LAW",
  "COR-MAND",
  "COR-MGMT",
  "COR-MLAY",
  "COR-OBHR",
  "COR-POSC",
  "COR-PPPM",
  "COR-PSYC",
  "COR-SOCG",
  "COR-SSOC",
  "COR-STAT",
  "COR-THAI",
  "CORE",
  "CS",
  "DSA",
  "ECON",
  "FNCE",
  "IDIS",
  "INTS",
  "IS",
  "LAW",
  "LGST",
  "MGMT",
  "MKTG",
  "OBHR",
  "OPIM",
  "POSC",
  "PPPM",
  "PSYC",
  "QF",
  "SMT",
  "SOCG",
  "SE",
  "STAT",
  "TRAD",
  "WRIT",
  "COR-XXXX",
  "COR-MKT",
  "COR-OBHR",
] as const;
export type BasketCode = (typeof basketCodes)[number];

export type Basket<T extends Track | undefined> = {
  name: BasketType;
  basketCode: BasketCode;
  modules: ModuleCode[];
  required: number;
  trackSpecific?: T;
};
