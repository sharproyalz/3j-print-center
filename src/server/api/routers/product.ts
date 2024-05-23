import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const productRouter = createTRPCRouter({
  create: protectedProcedure.input(schemas.product.create).mutation(({ ctx, input }) => {
    return ctx.db.product.create({ data: input, include: { service: true } });
  }),

  get: publicProcedure.input(schemas.product.get).query(({ input, ctx }) => {
    return ctx.db.product.findUnique({ where: input, include: { service: true } });
  }),

  getAll: publicProcedure.input(schemas.product.getAll).query(({ ctx, input }) => {
    return ctx.db.product.findMany({ where: input });
  }),

  update: protectedProcedure.input(schemas.product.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.product.update({
      where: { id },
      data,
    });
  }),

  delete: protectedProcedure.input(schemas.common.delete).mutation(({ ctx, input }) => {
    return ctx.db.product.delete({ where: input });
  }),
});
