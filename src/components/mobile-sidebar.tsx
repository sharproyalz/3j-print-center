'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button, buttonVariants } from '~/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import { siteConfig } from '~/config/site';
import { cn } from '~/lib/utils';
import { useSidebarStore } from '~/stores/sidebar';

type Props = { className?: string; isVisitor?: true };

export function MobileSidebar({ className, isVisitor }: Props) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const { adminSidebarLinks, userSidebarLinks } = useSidebarStore();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className={className}>
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="flex flex-col items-center justify-center gap-2 text-center">
            <Image src={siteConfig.icon} alt={`${siteConfig.name} Icon`} height={32} width={32} />

            <h2>Three J Print Center</h2>
          </SheetTitle>

          {/* <SheetDescription className="text-center">{meta.DESCRIPTION}</SheetDescription> */}
        </SheetHeader>

        <nav className="flex flex-col justify-center gap-1 py-4">
          {(isVisitor ? userSidebarLinks : adminSidebarLinks).map(({ Icon, name, href }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                buttonVariants({
                  variant: pathname === href ? 'secondary' : 'ghost',
                }),
                'relative justify-start gap-2'
              )}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-5 w-5" /> {name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
