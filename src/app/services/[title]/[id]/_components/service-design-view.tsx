'use client';

import { Product, Service } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { BreadcrumbComponent } from '~/app/services/[title]/[id]/_components/breadcrumb';
import { api } from '~/trpc/react';

type Props = {
  serviceInitialData: Service | null;
  productInitialData: Product[];
};

export function ServiceDesignsView({ serviceInitialData, productInitialData }: Props) {
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

  return (
    <>
      <main className="p-8">
        <div className="mx-auto my-0 max-w-screen-lg">
          <BreadcrumbComponent title={service?.title as string} />
          <div className="flex flex-col justify-between ">
            <div className="flex items-center justify-between">
              <div className="mt-4 flex items-center gap-4 text-4xl font-bold capitalize">
                <div>{service?.title}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-8">
            {serviceDesign?.length ? (
              serviceDesign?.map((image) => {
                return (
                  <div
                    key={image.id}
                    className="group relative flex h-[300px] w-[300px] flex-col items-center  rounded-sm bg-slate-500 p-4"
                  >
                    <div className="flex  items-center justify-center gap-4">
                      <Image src="/3J-icon.png" alt="" width={40} height={40} />
                      <div className="text-xl text-white">Product</div>
                    </div>

                    <div className="object-fit mx-auto mt-8 flex h-[12rem] w-[12rem]">
                      <CldImage
                        width="192"
                        height="192"
                        src={image.imageId}
                        alt="Avatar logo"
                        className=""
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full">
                <p className="">
                  Sorry, there are currently no design available for{' '}
                  <span className="font-bold">{service?.title}</span>, Please come back soon, as we
                  are in the process of creating beautiful and awesome designs for{' '}
                  <span className="font-bold">{service?.title}</span>
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
        </div>
      </main>
    </>
  );
}
