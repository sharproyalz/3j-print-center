import { z } from 'zod';

export const productSchemas = {
  create: z.object({
    serviceId: z.string().cuid(),
    image: z.string(),
    imageId: z.string(),
  }),

  get: z.object({
    id: z.string().cuid(),
  }),

  getAll: z.object({
    serviceId: z.string().cuid(),
  }),

  update: z.object({
    id: z.string().cuid(),
    image: z.string().optional(),
    imageId: z.string().optional(),
  }),
};
