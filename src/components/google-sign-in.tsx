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
      await signIn('google');
      setIsLoading(() => false);
    } catch (err) {
      setIsLoading(() => false);
      toast.error('❌ Sign in failed.');
    }
  }
  return (
    <>
      <Button variant="outline" onClick={handleClick} disabled={isLoading} className="text-black">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Sign in
      </Button>
    </>
  );
}
