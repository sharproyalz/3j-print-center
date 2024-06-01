'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/contacts/add/_components/breadcrumb';
import { ContactType } from '~/enums/contact-type';
import { api } from '~/trpc/react';
import { schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.contact.create>;

export function AddContactView() {
  const params = useParams();

  const router = useRouter();
  const addContactForm = useForm<Inputs>({ resolver: zodResolver(schemas.contact.create) });

  const addContact = api.contact.create.useMutation({
    onSuccess: async ({ id }) => {
      toast.success(`Contact has been added.`);
      console.log(`Contact has been added.`);
      await router.push(`/admin/contacts`);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (values) => {
    addContact.mutate(values);
    console.log(values);
  };
  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent />

          <div className="mt-4 text-4xl font-bold capitalize">Add New Contact</div>
        </div>

        {/* Forms */}
        <div className="pb-12">
          <div className="mt-8 flex justify-center gap-8">
            <form
              className="flex w-full flex-col items-center gap-8"
              onSubmit={addContactForm.handleSubmit(onSubmit, (err) => console.log(err))}
            >
              <div className="flex w-full flex-col">
                <label htmlFor="type">Type</label>

                <select
                  id="type"
                  className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                  {...addContactForm.register('type')}
                >
                  {Object.values(ContactType).map((contact, contactIdx) => (
                    <option key={contactIdx} value={contact.toUpperCase().replace(' ', '_')}>
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
                  {...addContactForm.register('detail')}
                />

                <p className="h-4 text-sm font-medium text-destructive">
                  {addContactForm.formState.errors.detail?.message}
                </p>
              </div>

              <div className="flex w-full gap-8">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-4 rounded-md bg-primary p-4 text-white active:scale-95"
                >
                  <div>Add</div>
                  <Plus />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
