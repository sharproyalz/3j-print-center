import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const serviceRouter = createTRPCRouter({
  create: publicProcedure.input(schemas.contact.create).mutation(({ ctx, input }) => {
    return ctx.db.contact.create({
      data: input,
    });
  }),
});
