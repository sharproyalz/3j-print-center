'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useParams, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/services/[id]/add/_components/breadcrumb';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/trpc/react';
import { schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.product.create>;

export function AddServiceDesignView() {
  const params = useParams();

  const router = useRouter();
  const addServiceDesignForm = useForm<Inputs>({ resolver: zodResolver(schemas.product.create) });

  const getServiceQuery = api.service.get.useQuery({ id: params.id as string });
  const service = getServiceQuery.data;

  const addServiceDesign = api.product.create.useMutation({
    onSuccess: async ({ id }) => {
      toast.success(`${service?.title} Design has been added.`);
      console.log(`${service?.title} Design has been added.`);
      await router.push(`/admin/services/${service?.id}`);
    },
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    addServiceDesignForm.setValue('image', result.info?.secure_url ?? '');
    addServiceDesignForm.setValue('imageId', result.info?.public_id ?? '');
  };

  const onSubmit: SubmitHandler<Inputs> = (values) => {
    addServiceDesign.mutate({ ...values, serviceId: service?.id as string });
    console.log({ ...values, serviceId: service?.id as string });
  };
  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent title={service?.title as string} id={service?.id as string} />

          <div className="mt-4 text-4xl font-bold capitalize">Add New {service?.title} Design</div>
        </div>

        {/* Forms */}
        <div className="pb-12">
          <div className="mt-8 flex justify-center gap-8">
            <form
              className="flex w-full flex-col items-center gap-8"
              onSubmit={addServiceDesignForm.handleSubmit(onSubmit, (err) => console.log(err))}
            >
              <div>
                {addServiceDesignForm.watch('imageId') ? (
                  <div className="object-fit mx-auto mt-8 flex h-[20rem] w-[20rem]">
                    <CldImage
                      width="320"
                      height="320"
                      src={addServiceDesignForm.watch('imageId') ?? ''}
                      alt="Avatar logo"
                      className=""
                    />
                  </div>
                ) : (
                  <div className=" h-[20rem] w-[20rem] bg-[#d9d9d9]"></div>
                )}

                <p className="h-4 text-sm font-medium text-destructive">
                  {addServiceDesignForm.formState.errors.image?.message}
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
