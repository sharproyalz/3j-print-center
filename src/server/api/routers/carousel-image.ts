import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const carouselImageRouter = createTRPCRouter({
  get: publicProcedure.input(schemas.carouselImage.get).query(({ input, ctx }) => {
    return ctx.db.carouselImage.findUnique({ where: input });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.carouselImage.findMany();
  }),

  create: protectedProcedure.input(schemas.carouselImage.create).mutation(({ ctx, input }) => {
    return ctx.db.carouselImage.create({ data: input });
  }),

  update: protectedProcedure.input(schemas.carouselImage.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.carouselImage.update({
      where: { id },
      data,
    });
  }),

  delete: protectedProcedure.input(schemas.common.delete).mutation(({ ctx, input }) => {
    return ctx.db.carouselImage.delete({ where: input });
  }),
});
