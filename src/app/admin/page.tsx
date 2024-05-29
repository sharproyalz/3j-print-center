'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';

export default function AdminPage() {
  const pathname = usePathname();

  return (
    <>
      <main className=" p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Welcome to Admin Page!</div>
        </div>

        <div className="mt-4 w-full">
          <p>
            In this page, you can edit the contents of your website that will display to the user.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            <li className="text-center">
              <Link className={``} href={`/admin/carousel-images`}>
                <div
                  className={cn(
                    'w-full rounded-lg border border-secondary p-4 hover:bg-secondary hover:text-white',
                    pathname === '/admin/carousel-images' ? 'bg-secondary text-white' : ''
                  )}
                >
                  Banners
                </div>
              </Link>
            </li>

            <li className="text-center">
              <Link href={`/admin/services`}>
                <div
                  className={cn(
                    'w-full rounded-lg border border-secondary p-4 hover:bg-secondary hover:text-white',
                    pathname === '/admin/services' ? 'bg-secondary text-white' : ''
                  )}
                >
                  Services
                </div>
              </Link>
            </li>

            <li className="text-center">
              <Link href={`/admin/contacts`}>
                <div
                  className={cn(
                    'w-full rounded-lg border border-secondary p-4 hover:bg-secondary hover:text-white',
                    pathname === '/admin/contacts' ? 'bg-secondary text-white' : ''
                  )}
                >
                  Contacts
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-12 ">
          <Link
            href={`/`}
            className="w-full rounded-lg bg-primary p-4 text-white hover:bg-primary/80"
          >
            Go back to main page
          </Link>
        </div>
      </main>
    </>
  );
}
