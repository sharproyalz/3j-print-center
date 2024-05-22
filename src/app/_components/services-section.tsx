'use client';

import { Service } from '@prisma/client';
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
    <section className="mx-auto my-0 max-w-screen-2xl px-16">
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
        {services?.map((service) => (
          <Link href="#" key={service.id} className="mt-8">
            <div className=" flex h-[300px] w-[300px] flex-col items-center gap-4 rounded-sm bg-slate-500 p-4">
              <div className="flex  items-center justify-center gap-4">
                <Image src="/3J-icon.png" alt="" width={40} height={40} />
                <div className="text-xl text-white">Services</div>
              </div>
              <Image src="/mug.jpg" alt="Mug" width={200} height={200} className="rounded-sm" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-bold text-primary hover:text-primary/80">
                {service.title} designs {`->`}{' '}
              </div>
              <div className="">{service.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
