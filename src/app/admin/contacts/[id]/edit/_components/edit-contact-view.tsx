'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Contact } from '@prisma/client';
import { Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/contacts/[id]/edit/_components/breadcrumb';
import { ContactType } from '~/enums/contact-type';
import { api } from '~/trpc/react';
import { schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.contact.update>;
type Props = {
  initialData: Contact | null;
};

export function EditContactView({ initialData }: Props) {
  const params = useParams();

  const router = useRouter();
  const getContactView = api.contact.get.useQuery({ id: params.id as string }, { initialData });
  const contact = getContactView.data;

  const updateContactForm = useForm<Inputs>({
    resolver: zodResolver(schemas.contact.update),
    values: {
      id: params.id as string,
      detail: contact?.detail,
      type: contact?.type,
    },
  });

  const updateContact = api.contact.update.useMutation({
    onSuccess: async ({ id }) => {
      toast.success('Contact has been updated.');
      console.log('Contact has been updated.');
      await router.push(`/admin/contacts`);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (values) => {
    updateContact.mutate(values);
    console.log(values);
  };

  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent />

          <div className="mt-4 text-4xl font-bold">Edit a Contact</div>
        </div>

        {/* Forms */}
        <div className="pb-12">
          <div className="mt-8 flex justify-center gap-8">
            <form
              className="flex w-full flex-col items-center gap-8"
              onSubmit={updateContactForm.handleSubmit(onSubmit, (err) => console.log(err))}
            >
              <div className="flex w-full flex-col">
                <label htmlFor="type">Type</label>

                <select
                  id="type"
                  className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                  {...updateContactForm.register('type')}
                >
                  {Object.values(ContactType).map((contact, contactIdx) => (
                    <option key={contactIdx} value={contact.toUpperCase()}>
                      {contact}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex w-full flex-col">
                <label htmlFor="details">Details</label>

                <input
                  type="text"
                  id="details"
                  placeholder=""
                  className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                  {...updateContactForm.register('detail')}
                />
              </div>
              <div className="flex w-full gap-8">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-4 rounded-md bg-primary p-4 text-white"
                >
                  <div>Save</div>
                  <Save />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
