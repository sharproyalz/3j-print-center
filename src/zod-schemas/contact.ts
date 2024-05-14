import { z } from 'zod';

export const contactSchemas = {
  create: z.object({
    type: z.string(),
    detail: z.string(),
  }),
};
