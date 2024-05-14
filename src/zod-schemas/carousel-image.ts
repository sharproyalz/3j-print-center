import { z } from 'zod';

export const carouselImage = {
  get: z.object({
    id: z.string().cuid().optional(),
    image: z.string(),
    imageId: z.string(),
    link: z.string().optional(),
  }),
};
