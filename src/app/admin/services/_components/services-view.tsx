'use client';

import { Service } from '@prisma/client';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ServiceProduct } from '~/app/admin/services/_components/service';
import { api } from '~/trpc/react';

type Props = {
  initialData: Service[];
};

export function ServicesView({ initialData }: Props) {
  const router = useRouter();
  const params = useParams();

  const getServicesView = api.service.getAll.useQuery(undefined, { initialData });
  const services = getServicesView.data;

  return (
    <>
      <main className=" p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Services</div>
        </div>

        <div className="mt-4 ">
          {services?.length ? (
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              <Link
                href={`/admin/services/add`}
                className="flex h-[300px] w-[300px] mt-[38.83px] items-center justify-center gap-4 rounded-sm border border-slate-500 p-4 hover:bg-slate-500 hover:text-white"
              >
                <div>Add</div>
                <Plus />
              </Link>

              {services?.map((service) => <ServiceProduct service={service} />)}
            </div>
          ) : (
            <div className="">
              <p className="">
                Hey! there are currently no services available, Our customers are eagerly awaiting
                our services. Please add one soon!
              </p>
              <p>
                To add one soon, Click{' '}
                <Link href={`/admin/services/add`} className="text-primary hover:text-primary/80">
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
