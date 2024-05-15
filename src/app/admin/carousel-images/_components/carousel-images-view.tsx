'use client';

import { CarouselImage } from '@prisma/client';
import { Plus } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
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
          <div className="text-4xl font-bold">Banner</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-8">
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
          ))}
        </div>
      </main>
    </>
  );
}
