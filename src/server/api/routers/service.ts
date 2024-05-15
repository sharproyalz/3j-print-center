import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const serviceRouter = createTRPCRouter({
  create: publicProcedure.input(schemas.service.create).mutation(({ ctx, input }) => {
    return ctx.db.service.create({ data: input });
  }),

  get: publicProcedure.input(schemas.service.get).query(({ input, ctx }) => {
    return ctx.db.service.findUnique({ where: input });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.service.findMany();
  }),
});
