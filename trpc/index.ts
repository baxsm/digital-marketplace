import { ProductQuerySchema } from "../schema";
import { authRouter } from "./authRouter";
import { publicProcedure, router } from "./trpc";
import * as z from "zod";
import { getPayloadClient } from "../getPayload";
import { paymentRouter } from "./paymentRouter";

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,

  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: ProductQuerySchema,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { limit, sort, ...queryOptions } = query;

      const payload = await getPayloadClient();

      const parsedQueryOptions: Record<string, { equals: string }> = {};

      Object.entries(queryOptions).forEach(([key, value]) => {
        parsedQueryOptions[key] = {
          equals: value,
        };
      });

      const page = cursor || 1;

      const {
        docs: products,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parsedQueryOptions,
        },
        sort,
        depth: 1,
        limit,
        page,
      });

      return {
        products,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});

export type AppRouter = typeof appRouter;
