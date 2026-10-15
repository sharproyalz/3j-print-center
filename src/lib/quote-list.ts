import type { Prisma } from '@prisma/client';

/** List rows omit the stored form JSON. The quotes screen does not read it. */
export const quoteListSelect = {
  id: true,
  customerName: true,
  mobileNumber: true,
  facebookMessengerName: true,
  emailAddress: true,
  consentGiven: true,
  selectedService: true,
  estimatedPrice: true,
  estimateSummary: true,
  notes: true,
  adminNotes: true,
  targetCompletionDate: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.QuoteRequestSelect;

export type QuoteListItem = Prisma.QuoteRequestGetPayload<{ select: typeof quoteListSelect }>;
