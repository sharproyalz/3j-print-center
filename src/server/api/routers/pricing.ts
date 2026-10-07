import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import {
  ensurePricingCatalog,
  getPricingCatalog,
  getPricingSettings,
} from '~/server/pricing/catalog';
import { schemas } from '~/zod-schemas';

export const pricingRouter = createTRPCRouter({
  getCatalog: publicProcedure.query(async ({ ctx }) => {
    return getPricingCatalog(ctx.db);
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    await ensurePricingCatalog(ctx.db);
    return ctx.db.priceRate.findMany({
      orderBy: [{ service: 'asc' }, { sortOrder: 'asc' }],
    });
  }),

  getSettings: protectedProcedure.query(async ({ ctx }) => {
    await ensurePricingCatalog(ctx.db);
    return ctx.db.priceSetting.findMany({
      orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }],
    });
  }),

  updateRates: protectedProcedure
    .input(schemas.pricing.updateRates)
    .mutation(async ({ ctx, input }) => {
      const ids = input.rates.map((rate) => rate.id);
      const existing = await ctx.db.priceRate.findMany({
        where: { id: { in: ids } },
        select: { id: true },
      });

      if (existing.length !== ids.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'One or more price rows could not be found.',
        });
      }

      await ctx.db.$transaction(
        input.rates.map((rate) =>
          ctx.db.priceRate.update({
            where: { id: rate.id },
            data: { rate: rate.rate },
          })
        )
      );

      return getPricingCatalog(ctx.db);
    }),

  updateSettings: protectedProcedure
    .input(schemas.pricing.updateSettings)
    .mutation(async ({ ctx, input }) => {
      const ids = input.settings.map((setting) => setting.id);
      const existing = await ctx.db.priceSetting.findMany({
        where: { id: { in: ids } },
        select: { id: true },
      });

      if (existing.length !== ids.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'One or more settings could not be found.',
        });
      }

      await ctx.db.$transaction(
        input.settings.map((setting) =>
          ctx.db.priceSetting.update({
            where: { id: setting.id },
            data: {
              ...(setting.value !== undefined ? { value: setting.value } : {}),
              ...(setting.textValue !== undefined ? { textValue: setting.textValue } : {}),
            },
          })
        )
      );

      return getPricingSettings(ctx.db);
    }),
});
