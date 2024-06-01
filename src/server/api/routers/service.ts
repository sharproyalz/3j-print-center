import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const serviceRouter = createTRPCRouter({
  create: protectedProcedure.input(schemas.service.create).mutation(({ ctx, input }) => {
    return ctx.db.service.create({ data: input });
  }),

  get: publicProcedure.input(schemas.service.get).query(({ input, ctx }) => {
    return ctx.db.service.findUnique({ where: input });
  }),

  getAll: publicProcedure.input(schemas.service.getAll).query(({ ctx, input }) => {
    return ctx.db.service.findMany({ orderBy: { createdAt: input?.orderBy ?? 'asc' } });
  }),

  update: protectedProcedure.input(schemas.service.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.service.update({
      where: { id },
      data,
    });
  }),

  delete: protectedProcedure.input(schemas.common.delete).mutation(({ ctx, input }) => {
    return ctx.db.service.delete({ where: input });
  }),
});
