import type { BidRecord } from "@prisma/client";
import { z } from "zod";

import type { ChartData } from "@/components/BidAnalytics/Chart";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const bidAnalyticsRouter = createTRPCRouter({
  getInstructors: publicProcedure
    .input(z.object({ moduleCode: z.string() }))
    .query(async ({ input, ctx }) => {
      const data = await ctx.db.bidRecord.findMany({
        where: {
          moduleCode: input.moduleCode,
        },
        select: {
          instructor: true,
        },
        distinct: ["moduleCode", "instructor"],
      });
      return data.flatMap((d) => d.instructor);
    }),
  getTermsAvailable: publicProcedure
    .input(z.object({ moduleCode: z.string(), instructor: z.string() }))
    .query(async ({ input, ctx }) => {
      const data = await ctx.db.bidRecord.findMany({
        where: {
          moduleCode: input.moduleCode,
          instructor: {
            has: input.instructor,
          },
          minBid: {
            gt: 0,
          },
        },
        select: {
          term: true,
        },
        distinct: ["moduleCode", "instructor", "term"],
      });
      return data
        .map((d) => d.term)
        .sort()
        .reverse();
    }),
  getSections: publicProcedure
    .input(
      z.object({
        moduleCode: z.string(),
        instructor: z.string(),
        term: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const data = await ctx.db.bidRecord.findMany({
        where: {
          moduleCode: input.moduleCode,
          instructor: {
            has: input.instructor,
          },
          term: input.term,
          minBid: {
            gt: 0,
          },
        },
        select: {
          section: true,
        },
        distinct: ["moduleCode", "instructor", "term", "section"],
      });
      return data.map((d) => d.section).sort();
    }),
  getChartData: publicProcedure
    .input(
      z.object({
        moduleCode: z.string(),
        instructor: z.string(),
        term: z.string(),
        section: z.string(),
      }),
    )
    .query(async ({ input, ctx }): Promise<ChartData[]> => {
      const data = await ctx.db.bidRecord.findMany({
        where: {
          moduleCode: input.moduleCode,
          instructor: {
            has: input.instructor,
          },
          term: input.term,
          section: input.section,
          minBid: {
            gt: 0,
          },
        },
      });
      return convertToChartData(data);
    }),
});

function convertToChartData(bidRecords: BidRecord[]): ChartData[] {
  return bidRecords.map((record) => ({
    window: record.biddingWindow,
    befVac: record.beforeProcessVacancy,
    aftVac: record.afterProcessVacancy,
    minBid: record.minBid,
    medBid: record.medianBid,
  }));
}
