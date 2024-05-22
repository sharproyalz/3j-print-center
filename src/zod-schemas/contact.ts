import { ContactType } from '@prisma/client';
import { z } from 'zod';

export const contactSchemas = {
  create: z.object({
    type: z.nativeEnum(ContactType),
    detail: z.string(),
  }),

  get: z.object({
    id: z.string().cuid(),
  }),

  update: z.object({
    id: z.string().cuid(),
    type: z.nativeEnum(ContactType).optional(),
    detail: z.string().optional(),
  }),

  delete: z.object({
    id: z.string().cuid(),
  }),
};
