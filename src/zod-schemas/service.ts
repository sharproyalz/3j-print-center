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
    id: z.string().cuid(),
  }),
};
