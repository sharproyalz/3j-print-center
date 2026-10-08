'use client';

import { signIn } from 'next-auth/react';
import { Button } from '~/components/ui/button';

export default function GoogleSignInButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="text-black active:scale-95"
      onClick={() => {
        void signIn('google', { callbackUrl: '/admin' });
      }}
    >
      Sign in
    </Button>
  );
}
