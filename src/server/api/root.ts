import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import { basketRouter } from "./routers/basket";
import { bidAnalyticsRouter } from "./routers/bidAnalytics";
import { iSyncRouter } from "./routers/iSync";
import { moduleRouter } from "./routers/module";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  module: moduleRouter,
  iSync: iSyncRouter,
  basket: basketRouter,
  bidAnalytics: bidAnalyticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
