'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { CustomDialog } from '~/components/custom-dialog';
import { Button } from '~/components/ui/button';

export function SignOut() {
  return (
    <CustomDialog
      description="Are you sure you want to sign out?"
      handleContinue={async () => {
        await signOut({ callbackUrl: '/' });
        toast.success('Signed out successfully.');
      }}
    >
      <Button
        variant="outline"
        className="w-10 p-0 text-black active:scale-95 md:w-auto md:px-4 md:py-2"
      >
        <LogOut className="md:mr-2" /> <span className="hidden md:block">Logout</span>
      </Button>
    </CustomDialog>
  );
}
