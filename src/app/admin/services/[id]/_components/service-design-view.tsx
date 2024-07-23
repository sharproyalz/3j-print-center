'use client';

import { Product, Service } from '@prisma/client';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BreadcrumbComponent } from '~/app/admin/services/[id]/_components/breadcrumb';
import { CustomDialog } from '~/components/custom-dialog';
import { PreviewImage } from '~/components/preview-image';
import { api } from '~/trpc/react';

type Props = {
  serviceInitialData: Service | null;
  productInitialData: Product[];
};

export function ServiceDesignView({ serviceInitialData, productInitialData }: Props) {
  const router = useRouter();
  const utils = api.useUtils();
  const params = useParams();

  const getServiceQuery = api.service.get.useQuery(
    { id: params.id as string },
    { initialData: serviceInitialData }
  );
  const service = getServiceQuery.data;

  const getServiceDesignQuery = api.product.getAll.useQuery(
    { serviceId: service?.id as string },
    { initialData: productInitialData }
  );
  const serviceDesign = getServiceDesignQuery.data;

  const deleteServiceDesign = api.product.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      await utils.product.invalidate();
      toast.success(`${service?.title} design has been deleted`);
      console.log(`${service?.title} design has been deleted`);
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      console.log('Internal Server Error');
    },
  });
  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent title={service?.title as string} />

          <div className="flex items-center justify-between">
            <div className="mt-4 flex items-center gap-4 text-4xl font-bold capitalize">
              <div>{service?.title}</div>
              <button
                type="button"
                onClick={() => router.push(`/admin/services/${service?.id}/edit`)}
                className="flex gap-4 rounded-md hover:text-primary active:scale-95"
              >
                <Pencil />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {serviceDesign?.length ? (
            <div className="flex flex-wrap justify-center gap-8 md:justify-start">
              <Link
                href={`/admin/services/${service?.id}/add`}
                className=" mt-[46.83px] flex h-[300px] w-[300px] items-center justify-center gap-4 rounded-sm border border-slate-500 p-4 hover:bg-slate-500 hover:text-white"
              >
                <div>Add</div>
                <Plus />
              </Link>

              {serviceDesign?.map((image) => {
                return (
                  <div key={image.id} className=" w-[300px]">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center justify-center gap-4">
                        <Image src="/3J-icon.png" alt="3J Icon" width={40} height={40} />
                        <div
                          className={`${(service?.title.length || 0) > 30 ? 'text-sm' : (service?.title.length || 0) > 25 ? 'text-md' : 'text-xl'} font-semibold`}
                        >
                          Product
                        </div>
                      </div>

                      <CustomDialog
                        handleContinue={() => deleteServiceDesign.mutate({ id: image.id })}
                        description="This action cannot be undone. This will permanently delete your service design from our servers."
                      >
                        <button
                          type="button"
                          className="rounded-md p-2 hover:bg-destructive hover:text-white active:scale-95"
                        >
                          <Trash2 />
                        </button>
                      </CustomDialog>
                    </div>

                    <PreviewImage imageId={image.imageId} service={service}>
                      <button type="button" className="flex h-[300px] w-[300px] object-fill">
                        <CldImage
                          width="300"
                          height="300"
                          src={image.imageId}
                          alt="Avatar logo"
                          className=""
                        />
                      </button>
                    </PreviewImage>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full">
              <p className="">
                Hey! there are currently no service design available for{' '}
                <span className="font-bold">{service?.title}</span>, To add one, Click{' '}
                <Link
                  href={`/admin/services/${service?.id}/add`}
                  className="text-primary hover:text-primary/80"
                >
                  here
                </Link>
              </p>

              <div className="mt-16 flex flex-col items-center">
                <Image
                  src={'/sad-face.svg'}
                  alt="Sad Face"
                  width={`360`}
                  height={`360`}
                  className=""
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
