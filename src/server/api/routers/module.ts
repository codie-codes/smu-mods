import { z } from "zod";

import type { ModuleCode } from "@/types/primitives/module";
import { getModuleJson } from "@/server/utils/getModuleJson";
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
      const modules = await getModuleJson();
      const temp = modules[input.moduleCode as ModuleCode];
      if (!temp) {
        return null;
      }
      return temp;
    }),
  searchModule: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const modules = await getModuleJson();
      const resultModules = searchModule(modules, input.query);
      return resultModules;
    }),
  getAllModules: publicProcedure.query(async () => {
    const modules = await getModuleJson();
    return modules;
  }),
});
