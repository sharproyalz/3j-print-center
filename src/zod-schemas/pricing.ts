import { PricingService } from '@prisma/client';
import { z } from 'zod';

export const pricingSchemas = {
  updateRates: z.object({
    rates: z
      .array(
        z.object({
          id: z.string().cuid(),
          rate: z.number().finite().positive('Rate must be greater than 0'),
        })
      )
      .min(1),
  }),

  updateSettings: z.object({
    settings: z
      .array(
        z
          .object({
            id: z.string().cuid(),
            value: z.number().finite().min(0, 'Value must be 0 or greater').optional(),
            textValue: z.string().trim().min(1).max(300).optional(),
          })
          .refine((row) => row.value !== undefined || row.textValue !== undefined, {
            message: 'Provide a numeric or text value.',
          })
      )
      .min(1),
  }),

  getByService: z.object({
    service: z.nativeEnum(PricingService),
  }),
};
