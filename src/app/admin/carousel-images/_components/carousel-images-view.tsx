'use client';

import { CarouselImage } from '@prisma/client';
import { Plus } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '~/trpc/react';

type Props = {
  initialData: CarouselImage[];
};

export function CarouselImagesView({ initialData }: Props) {
  const getCarouselImageQuery = api.carouselImage.getAll.useQuery(undefined, { initialData });
  const carouselImages = getCarouselImageQuery.data;

  return (
    <>
      <main className=" p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Banners</div>
        </div>

        <div className="mt-4 ">
          {carouselImages.length ? (
            <div className="flex flex-wrap gap-8">
              <Link
                href={`/admin/carousel-images/add`}
                className=" flex h-[24rem] w-[24rem] items-center justify-center gap-4 rounded-sm border border-slate-500 p-4 hover:bg-slate-500 hover:text-white"
              >
                <div>Add</div>
                <Plus />
              </Link>
              {carouselImages?.map((image) => (
                <Link
                  href={`/admin/carousel-images/${image.id}`}
                  key={image.id}
                  className="object-fit flex h-[24rem] w-[24rem]"
                >
                  <CldImage
                    width="384"
                    height="384"
                    src={image.imageId ?? ''}
                    alt="Carousel Image"
                    className=""
                  />
                </Link>
              ))}{' '}
            </div>
          ) : (
            <div className="">
              <p>
                Hey! there are currently no banners available. Our customers are eagerly awaiting
                our banner. Please add one soon!
              </p>
              <p>
                To add one soon, Click{' '}
                <Link
                  href={`/admin/carousel-images/add`}
                  className="text-primary hover:text-primary/80"
                >
                  here
                </Link>
              </p>
              <div className="mt-16 flex flex-col items-center">
                <Image src={'/empty-banner.svg'} alt="Slider" width={360} height={360} />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
