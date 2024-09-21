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
      <main className="p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Banners</div>
        </div>

        <div className="mt-4">
          {carouselImages.length ? (
            <div className="flex flex-wrap justify-center gap-8">
              <Link
                href={`/admin/carousel-images/add`}
                className="mx-auto mt-8 flex h-[120px] w-full max-w-[360px] items-center justify-center  gap-4 rounded-sm border border-slate-500 object-fill p-4 hover:bg-slate-500 hover:text-white md:h-[400px] md:max-w-[1200px]"
              >
                <div>Add</div>
                <Plus />
              </Link>
              {carouselImages?.map((image) => (
                <Link
                  href={`/admin/carousel-images/${image.id}`}
                  key={image.id}
                  className="mx-auto mt-8 flex h-[120px] w-full max-w-[360px] object-fill hover:opacity-90 md:h-[400px] md:max-w-[1200px]"
                >
                  <CldImage
                    width="1200"
                    height="400"
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
