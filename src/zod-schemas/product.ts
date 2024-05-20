import { z } from 'zod';

export const productSchemas = {
  create: z.object({
    image: z.string(),
    imageId: z.string(),
    serviceId: z.string().cuid(),
  }),

  get: z.object({
    id: z.string().cuid(),
  }),

  update: z.object({
    id: z.string().cuid(),
    image: z.string().optional(),
    imageId: z.string().optional(),
  }),
};
