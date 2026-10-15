'use client';

import { useState } from 'react';

/** Marks server-rendered query data as fresh so the browser does not refetch it on mount. */
export function useFreshInitialData<T>(initialData: T) {
  const [initialDataUpdatedAt] = useState(() => Date.now());
  return { initialData, initialDataUpdatedAt };
}
