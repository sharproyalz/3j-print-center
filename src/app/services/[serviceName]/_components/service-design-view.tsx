'use client';

import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

export function ServiceDesignsView() {
  const router = useRouter();
  const params = useParams();
  const serviceName = params.serviceName;

  const getServiceQuery = api.service.get.useQuery({ slug: serviceName as string });
  const service = getServiceQuery.data;

  const getServiceDesignQuery = api.product.getAll.useQuery({ serviceId: service?.id as string });
  const serviceDesign = getServiceDesignQuery.data;

  return (
    <>
      <main className="p-8">
        <div className="mx-auto my-0 max-w-screen-lg">
          <div className="flex flex-col justify-between ">
            <div className="flex items-center justify-between">
              <div className="mt-4 flex items-center gap-4 text-4xl font-bold capitalize">
                <div>{serviceName}</div>
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
                      <div className="text-xl text-white">Products</div>
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
                  <span className="font-bold">{serviceName}</span>, Please come back soon, as we are
                  in the process of creating beautiful and awesome designs for{' '}
                  <span className="font-bold">{serviceName}</span>
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
