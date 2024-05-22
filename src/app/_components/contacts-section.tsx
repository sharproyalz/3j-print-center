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
    <section className="mx-auto my-0 mt-16 flex max-w-screen-2xl gap-4 px-16">
      <Image src="/3J-banner.jpg" alt="3J Banner" width={1000} height={1000} />
      <div className="">
        <div className="text-xl font-semibold">Contact us</div>
        <div className="mt-4">
          {contacts?.map((contact) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
