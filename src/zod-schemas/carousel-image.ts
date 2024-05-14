import { z } from 'zod';

export const carouselImageSchemas = {
  create: z.object({
    image: z.string().url('Image is required'),
    imageId: z.string(),
    link: z.string().optional(),
  }),
};
