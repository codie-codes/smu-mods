import { baskets } from "@/server/data/basket";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const basketRouter = createTRPCRouter({
  getAllBaskets: publicProcedure.query(async () => {
    return baskets;
  }),
});
