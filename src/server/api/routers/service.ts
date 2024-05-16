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

  update: publicProcedure.input(schemas.service.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.service.update({
      where: { id },
      data,
    });
  }),

  delete: publicProcedure.input(schemas.common.delete).mutation(({ ctx, input }) => {
    return ctx.db.carouselImage.delete({ where: input });
  }),
});
