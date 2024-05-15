import { z } from 'zod';

export const carouselImageSchemas = {
  get: z.object({
    id: z.string().cuid(),
  }),

  create: z.object({
    image: z.string().url('Image is required'),
    imageId: z.string(),
    link: z.string().optional(),
  }),

  update: z.object({
    id: z.string().cuid(),
    image: z.string().optional(),
    imageId: z.string().optional(),
    link: z.string().nullable().optional(),
  }),
};
