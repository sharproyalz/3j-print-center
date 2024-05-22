'use client';

import { Instagram, Pencil, Phone, Plus, Trash2, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CustomDialog } from '~/components/custom-dialog';
import { api } from '~/trpc/react';

export default function ContactView() {
  const router = useRouter();
  const utils = api.useUtils();

  const getContactsQuery = api.contact.getAll.useQuery();
  const contacts = getContactsQuery.data;

  const deleteContact = api.contact.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast.success('✔️ Contact has been deleted');
      utils.contact.getAll.invalidate();
      router.push(`/admin/contacts`);
      console.log('✔️ Contact has been deleted');
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast.error('❌ Internal Server Error');
      console.log('❌ Internal Server Error');
    },
  });
  return (
    <>
      <main className=" p-8">
        <div className="flex items-center justify-between">
          <div className=" flex items-center gap-4 ">
            <div className="text-4xl font-bold">Contact</div>
          </div>
          <Link
            href="/admin/contacts/add"
            className="flex gap-4 rounded-md border border-primary p-4 hover:bg-primary hover:text-white"
          >
            <Plus />
            <div>Add</div>
          </Link>
        </div>

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
                <Link
                  href={`/admin/contacts/${contact.id}/edit`}
                  className="hidden hover:text-primary group-hover:block"
                >
                  <Pencil size={16} />
                </Link>
                <CustomDialog
                  description="This action cannot be undone. This will permanently delete your service from our servers."
                  handleContinue={() => deleteContact.mutate({ id: contact.id })}
                >
                  <button
                    type="button"
                    className="hidden text-destructive hover:text-primary group-hover:block"
                  >
                    <Trash2 size={16} />
                  </button>
                </CustomDialog>
              </div>
            ))
          ) : (
            <div>There are currently no contacts. Please add a new one</div>
          )}
        </div>
      </main>
    </>
  );
}
