import { z } from 'zod';

export const serviceSchemas = {
  create: z.object({
    id: z.string().cuid().optional(),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    image: z.string(),
    imageId: z.string(),
  }),

  get: z.object({
    slug: z.string(),
  }),

  update: z.object({
    id: z.string().cuid(),
    title: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    imageId: z.string().optional(),
  }),
};
