import type { Basket } from "./basket";

export type MajorCode = "IS" | "CS" | "SE" | "C&L";

export const availableTracks = [
  "PD",
  "DCS",
  "BA",
  "FINTECH",
  "SMT",
  "CYBERSEC",
  "CPS",
  "AI",
] as const;

export type Track = (typeof availableTracks)[number];

export type Major = {
  majorCode: MajorCode;
  baskets: Basket<Track>[];
  availableTracks: Track[];
};
