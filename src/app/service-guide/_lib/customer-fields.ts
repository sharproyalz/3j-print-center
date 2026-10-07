import { z } from 'zod';

export type CustomerFieldKey =
  | 'customerName'
  | 'mobileNumber'
  | 'emailAddress'
  | 'notes'
  | 'targetDate'
  | 'consent';

export type CustomerFieldErrors = Partial<Record<CustomerFieldKey, string>>;

function normalizeMobile(value: string) {
  return value.replace(/[\s\-()]/g, '');
}

export function isValidPhMobile(value: string) {
  const normalized = normalizeMobile(value);
  return /^(09\d{9}|\+639\d{9}|639\d{9})$/.test(normalized);
}

function todayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const customerFieldsSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Enter your full name.'),
  mobileNumber: z
    .string()
    .trim()
    .min(1, 'Enter your mobile number.')
    .refine(isValidPhMobile, 'Enter a valid PH mobile number (e.g. 09171234567).'),
  emailAddress: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || z.string().email().safeParse(value).success,
      'Enter a valid email address.'
    ),
  notes: z.string().trim().min(1, 'Add a short note about your order.'),
  targetDate: z
    .string()
    .trim()
    .min(1, 'Choose a target completion date.')
    .refine((value) => value >= todayLocalDate(), 'Choose today or a future date.'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please agree before continuing.' }),
  }),
});

export function validateCustomerFields(input: {
  customerName: string;
  mobileNumber: string;
  emailAddress: string;
  notes: string;
  targetDate: string;
  consent: boolean;
}): { ok: true } | { ok: false; errors: CustomerFieldErrors } {
  const result = customerFieldsSchema.safeParse(input);
  if (result.success) return { ok: true };

  const errors: CustomerFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (
      key === 'customerName' ||
      key === 'mobileNumber' ||
      key === 'emailAddress' ||
      key === 'notes' ||
      key === 'targetDate' ||
      key === 'consent'
    ) {
      if (!errors[key]) errors[key] = issue.message;
    }
  }

  return { ok: false, errors };
}
