'use client';

import { Service } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '~/trpc/react';
import { titleToSlug } from '~/utils/title-to-slug';

type Props = {
  initialData: Service[];
};

export function ServicesSectionView({ initialData }: Props) {
  const getServicesQuery = api.service.getAll.useQuery(undefined, { initialData });
  const services = getServicesQuery.data;
  return (
    <section
      id="services"
      className="mx-auto -mt-24 mb-0 max-w-screen-2xl px-8 pt-16 md:px-16 md:pt-24 "
    >
      <div className="">
        <div className="text-center text-2xl font-bold md:font-semibold">
          Three J’s services: We’re here to help you stand out
        </div>
        <div className="mt-4 text-center">
          Welcome to Three J Printing Shop, where quality meets creativity. Our dedicated team is
          committed to bringing your vision to life with precision and flair. From business cards to
          banners, let us help you make a lasting impression. Explore our range of services and let
          your uniqueness shine with Three J.
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {services.length ? (
          services?.map((service) => (
            <div key={service.id} className="mt-8">
              <div className=" flex h-[300px] w-[300px] flex-col items-center gap-4 rounded-sm bg-slate-500 p-4">
                <div className="flex  items-center justify-center gap-4">
                  <Image src="/3J-icon.png" alt="" width={40} height={40} />
                  <div className="text-xl text-white">{service.title}</div>
                </div>
                <Link
                  href={`/services/${titleToSlug(service.title)}/${service.id}`}
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
                  href={`/services/${titleToSlug(service.title)}/${service.id}`}
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
