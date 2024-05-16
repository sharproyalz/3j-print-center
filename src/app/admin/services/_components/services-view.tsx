'use client';

import { Service } from '@prisma/client';
import { Plus } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '~/trpc/react';

type Props = {
  initialData: Service[];
};

export function ServicesView({ initialData }: Props) {
  const getServicesView = api.service.getAll.useQuery(undefined, { initialData });
  const services = getServicesView.data;

  return (
    <>
      <main className=" p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Service</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-8">
          <Link
            href={`/admin/services/add`}
            className=" flex h-[300px] w-[300px] items-center justify-center gap-4 rounded-sm border border-slate-500 p-4 hover:bg-slate-500 hover:text-white"
          >
            <div>Add</div>
            <Plus />
          </Link>
          {services?.map((service) => {
            return (
              <Link href={`/admin/services/${service.slug}`} key={service.id} className="w-[20rem]">
                <div className=" flex h-[300px] w-[300px] flex-col items-center gap-4 rounded-sm bg-slate-500 p-4">
                  <div className="flex  items-center justify-center gap-4">
                    <Image src="/3J-icon.png" alt="" width={40} height={40} />
                    <div className="text-xl text-white">Services</div>
                  </div>
                  <div className="object-fit flex h-[12rem] w-[12rem]">
                    <CldImage
                      width="192"
                      height="192"
                      src={service.imageId ?? ''}
                      alt="Carousel Image"
                      className="rounded-sm"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm font-bold text-primary hover:text-primary/80">
                    {service.title} designs {`->`}{' '}
                  </div>
                  <div className="">{service.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
