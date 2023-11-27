import { getPayloadClient } from "../getPayload";
import { publicProcedure, router } from "./trpc";
import { AuthSchema } from "../schema";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      // check existing user
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length !== 0) {
        throw new TRPCError({
          code: "CONFLICT",
        });
      }

      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      return { success: true, sendToEmail: email };
    }),
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;

      const payload = await getPayloadClient();
      const isVerified = await payload.verifyEmail({
        collection: "users",
        token: token,
      });

      if (!isVerified) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return { success: true };
    }),
  signIn: publicProcedure.input(AuthSchema).mutation(async ({ input, ctx }) => {
    const { email, password } = input;
    const { res } = ctx;

    const payload = await getPayloadClient();
    try {
      await payload.login({
        collection: "users",
        data: {
          email: email,
          password: password,
        },
        res: res,
      });

      return {
        success: true,
      };
    } catch (error) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  }),
});
