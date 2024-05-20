'use client';

import { Plus } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useParams, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/services/[serviceName]/add/_components/breadcrumb';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/trpc/react';
import { schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.product.create>;

export function AddServiceDesignView() {
  const params = useParams();
  const serviceName = params.serviceName;

  const router = useRouter();
  const addServiceDesignForm = useForm<Inputs>();

  const getServiceQuery = api.service.get.useQuery({ slug: serviceName as string });
  const service = getServiceQuery.data;

  const addServiceDesign = api.product.create.useMutation({
    onSuccess: async ({ id }) => {
      toast.success(`✔️ ${serviceName} Design has been added.`);
      console.log(`✔️ ${serviceName} Design has been added.`);
      await router.push(`/admin/services/${serviceName}`);
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
          <BreadcrumbComponent serviceName={serviceName as string} />

          <div className="mt-4 text-4xl font-bold capitalize">Add New {serviceName} Design</div>
        </div>

        {/* Forms */}
        <div className="pb-12">
          <div className="mt-8 flex justify-center gap-8">
            <form
              className="flex w-full flex-col items-center gap-8"
              onSubmit={addServiceDesignForm.handleSubmit(onSubmit, (err) => console.log(err))}
            >
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
                  className="flex w-full items-center justify-center gap-4 rounded-md bg-primary p-4 text-white"
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
