import type { Term } from "../planner";
import type { BasketCode } from "./basket";
import type { ClassTime } from "./timetable";

export type ModuleCode = `${BasketCode}${number}${string}`;

export type Module = {
  name: string;
  moduleCode: ModuleCode;
  exam?: Exam;
  description: string;
  sections: Section[];
  coRequisite?: PreReqTree[];
  mutuallyExclusive?: ModuleCode[];
  credit: number;
  terms: Term[];
  preReq?: PreReqTree;
};

export type PreReqTree =
  | ModuleCode
  | { and: PreReqTree[] }
  | { or: PreReqTree[] }
  | { nOf: [number, PreReqTree[]] };

export type Section = {
  code: string;
  professor: Professor;
  location: Location;
  classes: ClassTime[];
};

export type Exam = {
  dateTime: Date;
  durationInHour: number;
};

export type Professor = {
  name: string;
};

export type Location = {
  building: string;
  room: string;
  level: number | `B${number}` | null;
};
