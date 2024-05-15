import { CarouselImageView } from '~/app/admin/carousel-images/[id]/_components/carousel-image-view';
import { api } from '~/trpc/server';

export default async function ViewCarouselImage({ params }: { params: { id: string } }) {
  const carouselImage = await api.carouselImage.get.query({ id: params.id });

  return <CarouselImageView initialData={carouselImage} />;
}
