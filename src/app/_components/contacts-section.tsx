'use client';

import { Contact } from '@prisma/client';
import { Instagram, Phone, Twitter } from 'lucide-react';
import Image from 'next/image';
import { api } from '~/trpc/react';

type Props = {
  initialData: Contact[];
};

export function ContactsSectionView({ initialData }: Props) {
  const getContactsQuery = api.contact.getAll.useQuery(undefined, { initialData });
  const contacts = getContactsQuery.data;

  return (
    <section
      id="contacts"
      className="mx-auto my-0 -mt-8 flex max-w-screen-2xl flex-col gap-4 px-8 pt-24 lg:flex-row lg:justify-between lg:px-16"
    >
      <div className="flex h-[100%] w-full object-fill lg:w-[75%]">
        <Image src="/3J-banner.jpg" alt="Three J Banner" width={1000} height={384} />
      </div>
      <div className="flex flex-col lg:w-[25%]">
        <div className="text-xl font-semibold">Contact us</div>
        <div className="mt-4">
          {contacts?.length ? (
            contacts?.map((contact) => (
              <div key={contact.id} className="group flex items-center gap-4 py-2">
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

                <div>{contact.detail}</div>
              </div>
            ))
          ) : (
            <div className="text-center">Sorry, there are no contact details available.</div>
          )}
        </div>
      </div>
    </section>
  );
}
