import { CircleUserRound, LayoutDashboard, Printer, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import GoogleSignInButton from '~/components/google-sign-in';
import { MobileSidebar } from '~/components/mobile-sidebar';
import { buttonVariants } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { siteConfig } from '~/config/site';
import { cn } from '~/lib/utils';
import { getServerAuthSession } from '~/server/auth';
import { SignOut } from './sign-out';

export async function NavigationBar() {
  const session = await getServerAuthSession();

  return (
    <header className="sticky top-0 z-40 flex h-[4.5rem] justify-between border-none bg-primary px-8  py-4 text-white">
      <div className="flex items-center gap-4">
        <MobileSidebar
          className="active:scale-95 md:hidden"
          isVisitor={session?.user ? undefined : true}
        />

        <div className="flex items-center gap-8">
          <Link href={`/`} className="flex items-center justify-center gap-4">
            <Image src={siteConfig.icon} alt={`${siteConfig.name} Icon`} width={50} height={50} />{' '}
            <span className="text-lg">Print Center</span>
          </Link>
        </div>
      </div>

      <nav className="hidden items-center gap-14 text-lg md:flex">
        <Link href={`/#services`} className="flex items-center gap-2 hover:text-white/80">
          <Printer /> <span>Services</span>
        </Link>
        <Link href={`/#about`} className="flex items-center gap-2 hover:text-white/80">
          <User />
          <span>About</span>
        </Link>
        <Link href={`/#contacts`} className="flex items-center gap-2 hover:text-white/80">
          <CircleUserRound />
          <span>Contact</span>
        </Link>
      </nav>

      {session?.user ? (
        <div className="flex items-center gap-4">
          <TooltipProvider delayDuration={0} disableHoverableContent>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={'/admin'}
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'icon' }),
                    'hidden text-black active:scale-95 md:inline-flex'
                  )}
                >
                  <LayoutDashboard />
                </Link>
              </TooltipTrigger>

              <TooltipContent side="bottom">
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>

            <SignOut />
          </TooltipProvider>
        </div>
      ) : (
        <GoogleSignInButton />
      )}
    </header>
  );
}
