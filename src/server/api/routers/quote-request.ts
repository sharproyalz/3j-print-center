import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { validateServiceFields } from '~/app/service-guide/_lib/service-fields';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { getPricingCatalog } from '~/server/pricing/catalog';
import { schemas } from '~/zod-schemas';

export const quoteRequestRouter = createTRPCRouter({
  create: publicProcedure.input(schemas.quoteRequest.create).mutation(async ({ ctx, input }) => {
    const catalog = await getPricingCatalog(ctx.db);
    const serviceValidation = validateServiceFields(input.selectedService, input.payload, {
      tarpaulin: catalog.tarpaulin,
      stickers: catalog.stickers,
      dtfShirt: catalog.dtfShirt,
      sublimation: catalog.sublimation,
      signageFrame: catalog.signageFrame,
      signageSintra: catalog.signageSintra,
      dtfTransferSpecialMinMeters: catalog.settings.dtfTransferSpecialMinMeters,
      sublimationLayoutFeeBelowQty: catalog.settings.sublimationQtyTier10,
    });

    if (!serviceValidation.ok) {
      const firstMessage = Object.values(serviceValidation.errors)[0];
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: firstMessage ?? 'Please complete all service details.',
      });
    }

    const { facebookMessengerName, emailAddress, payload, ...rest } = input;

    return ctx.db.quoteRequest.create({
      data: {
        ...rest,
        facebookMessengerName: facebookMessengerName || null,
        emailAddress: emailAddress || null,
        payload: payload as Prisma.InputJsonValue,
      },
    });
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }),

  getNewCount: protectedProcedure.query(({ ctx }) => {
    return ctx.db.quoteRequest.count({
      where: { status: 'NEW' },
    });
  }),

  get: protectedProcedure.input(schemas.quoteRequest.get).query(({ ctx, input }) => {
    return ctx.db.quoteRequest.findUnique({ where: input });
  }),

  updateStatus: protectedProcedure
    .input(schemas.quoteRequest.updateStatus)
    .mutation(({ ctx, input }) => {
      const { id, status } = input;
      return ctx.db.quoteRequest.update({
        where: { id },
        data: { status },
      });
    }),

  updateAdminNotes: protectedProcedure
    .input(schemas.quoteRequest.updateAdminNotes)
    .mutation(({ ctx, input }) => {
      const { id, adminNotes } = input;
      return ctx.db.quoteRequest.update({
        where: { id },
        data: { adminNotes: adminNotes || null },
      });
    }),

  delete: protectedProcedure.input(schemas.quoteRequest.delete).mutation(({ ctx, input }) => {
    return ctx.db.quoteRequest.delete({ where: input });
  }),
});
