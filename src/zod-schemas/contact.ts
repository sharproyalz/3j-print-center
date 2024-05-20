import { ContactType } from '@prisma/client';
import { z } from 'zod';

export const contactSchemas = {
  create: z.object({
    type: z.nativeEnum(ContactType),
    detail: z.string(),
  }),
};
