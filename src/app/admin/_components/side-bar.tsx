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
            <Link className={``} href={`/admin/carousel-image`}>
              <div
                className={cn(
                  'w-full rounded-lg p-4 hover:bg-secondary hover:text-white',
                  pathname === '/admin/carousel-image' ? 'bg-secondary text-white' : ''
                )}
              >
                Carousel Image
              </div>
            </Link>
          </li>

          <li className="">
            <Link href={`/admin/service`}>
              <div
                className={cn(
                  'w-full rounded-lg p-4 hover:bg-secondary hover:text-white',
                  pathname === '/admin/service' ? 'bg-secondary text-white' : ''
                )}
              >
                Service
              </div>
            </Link>
          </li>

          <li className="">
            <Link href={`/admin/contact`}>
              <div
                className={cn(
                  'w-full rounded-lg p-4 hover:bg-secondary hover:text-white',
                  pathname === '/admin/contact' ? 'bg-secondary text-white' : ''
                )}
              >
                Contact
              </div>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
