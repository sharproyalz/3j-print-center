'use client';

import { Contact, ContactType } from '@prisma/client';
import { Instagram, Phone, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '~/config/site';
import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';
import { sortContacts } from '~/utils/sort-contacts';

type Props = {
  initialData: Contact[];
};

export function ContactsSectionView({ initialData }: Props) {
  const getContactsQuery = api.contact.getAll.useQuery(undefined, { initialData });
  const contacts = getContactsQuery.data;
  const sortedContacts = sortContacts(contacts);

  return (
    <section
      id="contacts"
      className="mx-auto my-0 -mt-8 flex max-w-screen-2xl flex-col gap-4 px-8 pt-24 lg:flex-row lg:justify-between lg:px-16"
    >
      <div className="flex h-[100%] w-full object-fill lg:w-[75%]">
        <Image
          src="/three-j-banner.jpg"
          alt={`${siteConfig.name} Banner`}
          width={1000}
          height={384}
        />
      </div>

      <div className="flex flex-col gap-2 lg:w-[25%]">
        <h2 className="text-xl font-semibold">Contact us</h2>

        <div className="mt-4 flex flex-col gap-4">
          {contacts?.length ? (
            (Object.keys(sortedContacts) as ContactType[]).map((contactType) => {
              return sortContacts(contacts)[contactType].map((contact) => (
                <Link
                  key={contact.id}
                  href={contact.type === 'EMAIL' ? `mailto:${contact.detail}` : '/#contacts'}
                  className={cn(
                    'group flex items-center gap-4',
                    contact.type !== 'EMAIL' && 'pointer-events-none'
                  )}
                  aria-disabled={contact.type !== 'EMAIL'}
                >
                  {contact.type === 'EMAIL' ? (
                    <Image src="/gmail.png" alt="Gmail Icon" height={28} width={28} />
                  ) : contact.type === 'FACEBOOK' ? (
                    <Image src="/fb.png" alt="Facebook Icon" height={28} width={28} />
                  ) : contact.type === 'CONTACT_NUMBER' ? (
                    <Phone width={28} />
                  ) : contact.type === 'INSTAGRAM' ? (
                    <Instagram width={28} />
                  ) : contact.type === 'X' ? (
                    <Twitter width={28} />
                  ) : (
                    <div>There currently no contact. Please create a new one</div>
                  )}

                  <p>{contact.detail}</p>
                </Link>
              ));
            })
          ) : (
            <div className="text-center">Sorry, there are no contact details available.</div>
          )}
        </div>
      </div>
    </section>
  );
}
