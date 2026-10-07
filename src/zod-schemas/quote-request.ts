import { QuoteStatus } from '@prisma/client';
import { z } from 'zod';

import { isValidPhMobile } from '~/app/service-guide/_lib/customer-fields';
import { SERVICES, type ServiceId } from '~/app/service-guide/_lib/pricing';

const serviceIds = SERVICES.map((service) => service.id) as [ServiceId, ...ServiceId[]];

export const quoteRequestSchemas = {
  create: z.object({
    customerName: z.string().trim().min(2, 'Customer name is required'),
    mobileNumber: z
      .string()
      .trim()
      .min(1, 'Mobile number is required')
      .refine(isValidPhMobile, 'Enter a valid PH mobile number'),
    facebookMessengerName: z.string().trim().optional(),
    emailAddress: z
      .string()
      .trim()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    consentGiven: z.literal(true, {
      errorMap: () => ({ message: 'Consent is required' }),
    }),
    selectedService: z.enum(serviceIds),
    estimatedPrice: z.string().trim().min(1, 'Estimated price is required'),
    estimateSummary: z.string().trim().min(1, 'Estimate summary is required'),
    notes: z.string().trim().min(1, 'Order notes are required'),
    targetCompletionDate: z.string().trim().min(1, 'Target date is required'),
    payload: z.record(z.unknown()),
  }),

  get: z.object({
    id: z.string().cuid(),
  }),

  updateStatus: z.object({
    id: z.string().cuid(),
    status: z.nativeEnum(QuoteStatus),
  }),

  updateAdminNotes: z.object({
    id: z.string().cuid(),
    adminNotes: z.string().trim(),
  }),

  delete: z.object({
    id: z.string().cuid(),
  }),
};
