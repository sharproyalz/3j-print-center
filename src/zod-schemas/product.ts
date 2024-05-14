import { z } from 'zod';

export const productSchemas = {
  create: z.object({
    image: z.string(),
    imageId: z.string(),
  }),
};
