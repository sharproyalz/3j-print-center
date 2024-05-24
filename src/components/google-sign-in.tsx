'use client';

import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { GoogleIcon } from '~/components/svg/google';
import { Button } from '~/components/ui/button';

export default function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(() => true);
      await signIn('google', { callbackUrl: '/admin' });
      setIsLoading(() => false);
    } catch (err) {
      setIsLoading(() => false);
      toast.error('Sign in failed.');
    }
  }
  return (
    <>
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={isLoading}
        className="w-10 p-0 text-black md:w-auto md:px-4 md:py-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin md:mr-2" />
        ) : (
          <GoogleIcon className="h-4 w-4 md:mr-2" />
        )}
        <span className="hidden md:block">Sign in</span>
      </Button>
    </>
  );
}
