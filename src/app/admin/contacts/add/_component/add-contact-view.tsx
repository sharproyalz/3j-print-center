'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/contacts/add/_component/breadcrumb';
import { api } from '~/trpc/react';
import { schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.contact.create>;

export function AddContactView() {
  const router = useRouter();
  const contactForm = useForm<Inputs>();

  const addContact = api.contact.create.useMutation({
    onSuccess: async ({ id }) => {
      toast.success('✔️ Contact has been added.');
      console.log('✔️ Contact has been added.');
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

          <div className="mt-4 text-4xl font-bold">Add New Banner</div>
        </div>

        {/* Forms */}
        <div className="flex flex-col pb-12">
          <form
            onSubmit={contactForm.handleSubmit(onSubmit, (err) => console.log(err))}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col">
              <label htmlFor="details">Details</label>

              <input
                type="text"
                id="details"
                className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-4 rounded-md bg-primary p-4 text-white"
            >
              <Plus />
              <div>Add</div>
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
