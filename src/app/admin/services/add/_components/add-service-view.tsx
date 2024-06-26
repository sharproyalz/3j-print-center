'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/services/add/_components/breadcrumb';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/trpc/react';
import { schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.service.create>;

export default function AddServiceView() {
  const router = useRouter();
  const addServiceForm = useForm<Inputs>({ resolver: zodResolver(schemas.service.create) });

  const addService = api.service.create.useMutation({
    onSuccess: async ({ id }) => {
      toast.success('Service has been added.');
      console.log('Service has been added.');
      await router.push(`/admin/services`);
    },
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    addServiceForm.setValue('image', result.info?.secure_url ?? '');
    addServiceForm.setValue('imageId', result.info?.public_id ?? '');
  };

  const onSubmit: SubmitHandler<Inputs> = (values) => {
    addService.mutate(values);
    console.log(values);
  };

  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent />

          <div className="mt-4 text-4xl font-bold">Add New Service</div>
        </div>

        {/* Forms */}
        <form
          onSubmit={addServiceForm.handleSubmit(onSubmit, (err) => console.log(err))}
          className="pb-12"
        >
          <div className="mt-8 flex gap-8">
            <div className="flex flex-col gap-8">
              <div>
                {addServiceForm.watch('imageId') ? (
                  <div className="object-fit mx-auto flex h-[20rem] w-[20rem]">
                    <CldImage
                      width="320"
                      height="320"
                      src={addServiceForm.watch('imageId') ?? ''}
                      alt="Avatar logo"
                      className=""
                    />
                  </div>
                ) : (
                  <div className="mx-auto h-[20rem] w-[20rem] bg-[#d9d9d9]"></div>
                )}

                <p className="h-4 text-sm font-medium text-destructive">
                  {addServiceForm.formState.errors.image?.message}
                </p>
              </div>

              <UploadButton
                className="w-full rounded-lg border border-secondary p-4 hover:bg-secondary hover:text-white"
                folder="service-images"
                resourceType={ResourceType.IMAGE}
                onSuccess={onSuccessUpload}
              >
                Upload
              </UploadButton>
            </div>

            <div className="flex flex-col gap-8">
              {/* Name */}
              <div className="flex flex-col">
                <label htmlFor="service-name">Name</label>

                <input
                  type="text"
                  id="service-name"
                  className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                  {...addServiceForm.register('title')}
                />

                <p className="h-4 text-sm font-medium text-destructive">
                  {addServiceForm.formState.errors.title?.message}
                </p>
              </div>

              {/* Short Description */}
              <div className="flex flex-col">
                <label htmlFor="description">Short Description</label>

                <textarea
                  id="description"
                  rows={4}
                  className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                  {...addServiceForm.register('description')}
                ></textarea>

                <p className="h-4 text-sm font-medium text-destructive">
                  {addServiceForm.formState.errors.description?.message}
                </p>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-4 rounded-md bg-primary p-4 text-white active:scale-95"
              >
                <div>Add</div>
                <Plus />
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
