import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const contactRouter = createTRPCRouter({
  create: protectedProcedure.input(schemas.contact.create).mutation(({ ctx, input }) => {
    return ctx.db.contact.create({
      data: input,
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.contact.findMany();
  }),

  get: publicProcedure.input(schemas.contact.get).query(({ ctx, input }) => {
    return ctx.db.contact.findUnique({ where: input });
  }),

  update: protectedProcedure.input(schemas.contact.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.contact.update({
      where: { id },
      data,
    });
  }),

  delete: protectedProcedure.input(schemas.contact.delete).mutation(({ ctx, input }) => {
    return ctx.db.contact.delete({ where: input });
  }),
});
