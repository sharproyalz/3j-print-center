import { z } from 'zod';

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export const serviceSchemas = {
  create: z.object({
    id: z.string().cuid().optional(),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().min(1, 'Description is required'),
    image: z.string(),
    imageId: z.string(),
  }),

  get: z.object({
    id: z.string(),
  }),

  getAll: z
    .object({
      orderBy: z.nativeEnum(OrderBy).optional(),
    })
    .optional(),

  update: z.object({
    id: z.string().cuid(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    imageId: z.string().optional(),
  }),
};
