import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '~/components/ui/carousel';

export function ProductCarousel() {
  const postImages = ['arise-3j.jpg', 'intro-3j.jpg', 'subli-3j.jpg'];

  return (
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
        {postImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="flex w-full items-center justify-center p-4">
              <Image
                src={`/carousel-photos/${image}`}
                alt={'Carousel Photo'}
                width={768}
                height={768}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
