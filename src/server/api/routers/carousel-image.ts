import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const carouselImageRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.carouselImage.findMany();
  }),

  create: protectedProcedure.input(schemas.carouselImage.create).mutation(({ ctx, input }) => {
    return ctx.db.carouselImage.create({ data: input });
  }),

  delete: protectedProcedure.input(schemas.common.delete).mutation(({ ctx, input }) => {
    return ctx.db.carouselImage.delete({ where: input });
  }),
});
