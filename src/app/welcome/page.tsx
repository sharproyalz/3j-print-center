'use client';

import { toast } from 'sonner';

export default function WelcomePage() {
  return (
    <button
      type="button"
      onClick={() => {
        return toast.success('Service has been added.'), console.log('Service has been added.');
      }}
      className="h-20 w-20 bg-primary active:scale-95"
    >
      ASDSDA
    </button>
  );
}
