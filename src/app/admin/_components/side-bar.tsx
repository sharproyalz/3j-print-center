'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';

export function SideBar() {
  const pathname = usePathname();
  return (
    <>
      <aside className="hidden p-[2rem] shadow-md md:block md:w-72">
        <ul className="sticky top-[6.5rem]">
          <li className="">
            <Link className={``} href={`/admin/carousel-images`}>
              <div
                className={cn(
                  'w-full rounded-lg p-4 hover:bg-secondary hover:text-white',
                  pathname === '/admin/carousel-images' ? 'bg-secondary text-white' : ''
                )}
              >
                Banners
              </div>
            </Link>
          </li>

          <li className="">
            <Link href={`/admin/services`}>
              <div
                className={cn(
                  'w-full rounded-lg p-4 hover:bg-secondary hover:text-white',
                  pathname === '/admin/services' ? 'bg-secondary text-white' : ''
                )}
              >
                Services
              </div>
            </Link>
          </li>

          <li className="">
            <Link href={`/admin/contacts`}>
              <div
                className={cn(
                  'w-full rounded-lg p-4 hover:bg-secondary hover:text-white',
                  pathname === '/admin/contacts' ? 'bg-secondary text-white' : ''
                )}
              >
                Contacts
              </div>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
