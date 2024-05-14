import { z } from 'zod';

export const carouselImage = {
  get: z.object({
    id: z.string().cuid().optional(),
    type: z.string(),
    detail: z.string(),
  }),
};
