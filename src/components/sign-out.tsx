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
        toast.success('✔️ Signed out successfully.');
      }}
    >
      <Button variant="outline" className="text-black">
        <LogOut className="mr-2" /> Logout
      </Button>
    </CustomDialog>
  );
}
