'use client';

import { api } from '~/trpc/react';

/** Shared by the admin sidebar and mobile menu so both subscribe to one count query. */
export function useNewQuoteCount(enabled = true) {
  return api.quoteRequest.getNewCount.useQuery(undefined, {
    enabled,
    refetchInterval: enabled ? 30_000 : false,
  });
}
