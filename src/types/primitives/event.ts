import { z } from "zod";

const stringToDateSchema = z.string().transform((date) => {
  return new Date(date);
});

export const schoolEventSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  date: stringToDateSchema,
  startTime: stringToDateSchema,
  endTime: stringToDateSchema,
  venue: z.string(),
  deadline: stringToDateSchema,
});

export type SchoolEvent = z.infer<typeof schoolEventSchema>;
