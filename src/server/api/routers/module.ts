import { z } from "zod";

import type { ModuleCode } from "@/types/primitives/module";
import { modules } from "@/server/data/moduleBank";
import { searchModule } from "@/utils/moduleBank";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const moduleRouter = createTRPCRouter({
  getModule: publicProcedure
    .input(
      z.object({
        moduleCode: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const module = modules[input.moduleCode as ModuleCode];
      if (!module) {
        return null;
      }
      return module;
    }),
  searchModule: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const resultModules = searchModule(modules, input.query);
      return resultModules;
    }),
  getAllModules: publicProcedure.query(async () => {
    return modules;
  }),
});
