'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Service } from '@prisma/client';
import { Save } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useParams, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/services/[id]/edit/_components/breadcrumb';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/trpc/react';
import { schemas } from '~/zod-schemas';

type Props = {
  initialData: Service | null;
};
type Inputs = z.infer<typeof schemas.service.update>;

export default function EditServiceView({ initialData }: Props) {
  const params = useParams();
  const id = params.id;

  const getServiceQuery = api.service.get.useQuery({ id: id as string }, { initialData });
  const service = getServiceQuery.data;

  const router = useRouter();
  const updateServiceForm = useForm<Inputs>({
    resolver: zodResolver(schemas.service.update),
    values: {
      id: service?.id as string,
      title: service?.title,
      description: service?.description,

      image: service?.image,
      imageId: service?.imageId,
    },
  });

  const updateService = api.service.update.useMutation({
    onSuccess: async ({ id }) => {
      toast.success('Service has been updated.');
      console.log('Service has been updated.');
      await router.push(`/admin/services`);
    },
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    updateServiceForm.setValue('image', result.info?.secure_url ?? '');
    updateServiceForm.setValue('imageId', result.info?.public_id ?? '');
  };

  const onSubmit: SubmitHandler<Inputs> = (values) => {
    updateService.mutate(values);
    console.log(values);
  };

  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent title={service?.title as string} id={service?.id as string} />

          <div className="mt-4 text-4xl font-bold">Edit a Service</div>
        </div>

        {/* Forms */}
        <form
          onSubmit={updateServiceForm.handleSubmit(onSubmit, (err) => console.log(err))}
          className="pb-12"
        >
          <div className="mt-8 flex gap-8">
            <div className="flex flex-col gap-8">
              {updateServiceForm.watch('imageId') ? (
                <div className="object-fit mx-auto mt-8 flex h-[20rem] w-[20rem]">
                  <CldImage
                    width="320"
                    height="320"
                    src={updateServiceForm.watch('imageId') ?? ''}
                    alt="Avatar logo"
                    className=""
                  />
                </div>
              ) : (
                <div className="mx-auto mt-8 h-[20rem] w-[20rem] bg-[#d9d9d9]"></div>
              )}
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
                  {...updateServiceForm.register('title')}
                />
              </div>

              {/* Short Description */}
              <div className="flex flex-col">
                <label htmlFor="description">Short Description</label>

                <textarea
                  id="description"
                  className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                  {...updateServiceForm.register('description')}
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-4 rounded-md bg-primary p-4 text-white"
              >
                <div>Save</div>
                <Save />
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
