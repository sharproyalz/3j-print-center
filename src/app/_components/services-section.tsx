'use client';

import { Service } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '~/trpc/react';

type Props = {
  initialData: Service[];
};

export function ServicesSectionView({ initialData }: Props) {
  const getServicesQuery = api.service.getAll.useQuery(undefined, { initialData });
  const services = getServicesQuery.data;
  return (
    <section id="services" className="mx-auto -mt-24 mb-0 max-w-screen-2xl px-16 pt-24">
      <div className="">
        <div className="text-center text-2xl font-semibold">
          3J’s services: We’re here to help you stand out
        </div>
        <div className="mt-4 text-center">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias itaque natus minus ducimus
          sed quia impedit! Sint tempore tempora nulla quaerat! Debitis, dolor. Iste at alias
          officiis possimus amet voluptate, adipisci a ipsa assumenda doloribus distinctio
          voluptatum minus illum fuga aperiam minima sint! Consequatur odio ipsa eius mollitia
          delectus corrupti?
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {services.length ? (
          services?.map((service) => (
            <div key={service.id} className="mt-8">
              <div className=" flex h-[300px] w-[300px] flex-col items-center gap-4 rounded-sm bg-slate-500 p-4">
                <div className="flex  items-center justify-center gap-4">
                  <Image src="/3J-icon.png" alt="" width={40} height={40} />
                  <div className="text-xl text-white">{service.title}</div>
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="object-fit flex h-[12rem] w-[12rem]"
                >
                  <CldImage
                    width="192"
                    height="192"
                    src={service.imageId ?? ''}
                    alt="Service Image"
                    className="rounded-sm"
                  />
                </Link>
              </div>
              <div className="mt-4">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm font-bold text-primary hover:text-primary/80"
                >
                  Show all designs {`->`}
                </Link>

                <div className="">{service.description}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 mt-8 flex flex-col items-center justify-center text-center font-bold">
            <div className="">
              Hey! there are currently no services available, but we assure you that we offer a wide
              variety of services
            </div>
            <Image
              src={'/sad-face.svg'}
              alt="Sad Face"
              width={`256`}
              height={`256`}
              className="mt-8"
            />
          </div>
        )}
      </div>
    </section>
  );
}
