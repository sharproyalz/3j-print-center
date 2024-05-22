'use client';

import { CarouselImage } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '~/components/ui/carousel';
import { api } from '~/trpc/react';

type Props = {
  initialData: CarouselImage[];
};

export function ProductCarousel({ initialData }: Props) {
  const getCarouselImageQuery = api.carouselImage.getAll.useQuery(undefined, { initialData });
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
            <div className="object-fit mx-auto flex h-[32rem] w-[32rem] bg-secondary">
              <CldImage
                width="512"
                height="512"
                src={image.imageId ?? ''}
                alt="Banner"
                className=""
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  ) : (
    <div className="object-fit mx-auto flex h-[32rem] w-[32rem] flex-col items-center justify-center gap-16 text-center">
      <div>
        Sorry, there are currently no banners here. We are in the process of setting them up. Please
        come back soon!
      </div>
      <Image src={`/empty-banner.svg`} alt="Slider" height={320} width={320} />
    </div>
  );
}
