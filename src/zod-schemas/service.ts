import { z } from 'zod';

export const service = {
  get: z.object({
    id: z.string().cuid().optional(),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    image: z.string(),
    imageId: z.string(),

    product: z.object({
      id: z.string().cuid().optional(),
      image: z.string(),
      imageId: z.string(),
    }),
  }),
};
