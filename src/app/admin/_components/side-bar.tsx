'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';

export function SideBar() {
  const pathname = usePathname();
  const newQuotesQuery = api.quoteRequest.getNewCount.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const newQuotesCount = newQuotesQuery.data ?? 0;

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

          <li className="">
            <Link href={`/admin/quotes`}>
              <div
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg p-4 hover:bg-secondary hover:text-white',
                  pathname === '/admin/quotes' ? 'bg-secondary text-white' : ''
                )}
              >
                <span>Quotes</span>
                {newQuotesCount > 0 ? (
                  <span
                    className={cn(
                      'text-xs tabular-nums',
                      pathname === '/admin/quotes' ? 'text-white/80' : 'text-muted-foreground'
                    )}
                  >
                    {newQuotesCount}
                  </span>
                ) : null}
              </div>
            </Link>
          </li>

          <li className="">
            <Link href={`/admin/pricing`}>
              <div
                className={cn(
                  'w-full rounded-lg p-4 hover:bg-secondary hover:text-white',
                  pathname === '/admin/pricing' ? 'bg-secondary text-white' : ''
                )}
              >
                Pricing
              </div>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
