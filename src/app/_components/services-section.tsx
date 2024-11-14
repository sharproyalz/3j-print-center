'use client';

import { Service } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '~/config/site';
import { api } from '~/trpc/react';
import { titleToSlug } from '~/utils/title-to-slug';
import { OrderBy } from '~/zod-schemas/service';

type Props = {
  initialData: Service[];
};

export function ServicesSectionView({ initialData }: Props) {
  const getServicesQuery = api.service.getAll.useQuery({ orderBy: OrderBy.ASC }, { initialData });
  const services = getServicesQuery.data;

  return (
    <section
      id="services"
      className="mx-auto -mt-24 mb-0 max-w-screen-2xl px-8 pt-16 md:px-16 md:pt-24 "
    >
      <div className="">
        <h1 className="text-center text-2xl font-bold md:font-semibold">
          Discover Top-Quality Printing Services with Three J Print Center
        </h1>

        <p className="mt-4 text-center">{siteConfig.description}</p>
      </div>

      <div className="mx-auto grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 md:place-items-start lg:grid-cols-4">
        {services.length ? (
          services?.map((service) => (
            <div key={service.id} className="col-span-1 mt-8 w-full max-w-[300px]">
              <div className="mb-2 flex items-center justify-center gap-4">
                <Image
                  src={siteConfig.icon}
                  alt="Three J Print Center Icon"
                  width={40}
                  height={40}
                />

                <h3
                  className={`${service.title.length > 30 ? 'text-sm' : service.title.length > 25 ? 'text-md' : 'text-xl'} font-semibold`}
                >
                  {service.title}
                </h3>
              </div>

              <div className="flex h-[300px] w-full flex-col items-center gap-4 rounded-sm bg-slate-500">
                <Link
                  href={`/services/${service.id}/${titleToSlug(service.title)}`}
                  className="flex h-full w-full object-fill"
                >
                  <CldImage
                    width="300"
                    height="300"
                    src={service.imageId ?? ''}
                    alt={`${service.title} Image`}
                    className="rounded-sm border border-gray-400"
                  />
                </Link>
              </div>

              <div className="mt-4">
                <Link
                  href={`/services/${service.id}/${titleToSlug(service.title)}`}
                  className="text-sm font-bold text-primary hover:text-primary/80"
                >
                  Show all designs {`->`}
                </Link>

                <p className="">{service.description}</p>
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
