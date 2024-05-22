import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const contactRouter = createTRPCRouter({
  create: publicProcedure.input(schemas.contact.create).mutation(({ ctx, input }) => {
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

  update: publicProcedure.input(schemas.contact.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.contact.update({
      where: { id },
      data,
    });
  }),

  delete: publicProcedure.input(schemas.contact.delete).mutation(({ ctx, input }) => {
    return ctx.db.contact.delete({ where: input });
  }),
});
