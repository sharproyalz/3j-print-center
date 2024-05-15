import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const carouselImageRouter = createTRPCRouter({
  get: publicProcedure.input(schemas.carouselImage.get).query(({ input, ctx }) => {
    return ctx.db.carouselImage.findUnique({ where: input });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.carouselImage.findMany();
  }),

  create: publicProcedure.input(schemas.carouselImage.create).mutation(({ ctx, input }) => {
    return ctx.db.carouselImage.create({ data: input });
  }),

  update: publicProcedure.input(schemas.carouselImage.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.carouselImage.update({
      where: { id },
      data,
    });
  }),

  delete: publicProcedure.input(schemas.common.delete).mutation(({ ctx, input }) => {
    return ctx.db.carouselImage.delete({ where: input });
  }),
});
