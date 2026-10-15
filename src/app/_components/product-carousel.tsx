'use client';

import { CarouselImage } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '~/components/ui/carousel';
import { api } from '~/trpc/react';
import { useFreshInitialData } from '~/trpc/use-fresh-initial-data';

type Props = {
  initialData: CarouselImage[];
};

export function ProductCarousel({ initialData }: Props) {
  const carouselQueryOptions = useFreshInitialData(initialData);
  const getCarouselImageQuery = api.carouselImage.getAll.useQuery(undefined, carouselQueryOptions);
  const carouselImage = getCarouselImageQuery.data;

  return carouselImage?.length ? (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full text-black"
    >
      <CarouselContent>
        {carouselImage?.map((image) => (
          <CarouselItem key={image.id}>
            <div className="mx-auto flex h-full w-full object-fill md:h-[400px]">
              <CldImage
                width="1200"
                height="400"
                src={image.imageId ?? ''}
                alt="Banner"
                className="h-auto w-full"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  ) : (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div>
        Sorry, there are currently no banners here. We are in the process of setting them up. Please
        come back soon!
      </div>
      <Image
        src={`/empty-banner.svg`}
        alt="Slider"
        height={320}
        width={320}
        className="h-auto w-full max-w-xs"
      />
    </div>
  );
}
