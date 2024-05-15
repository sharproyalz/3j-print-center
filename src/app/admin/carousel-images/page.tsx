import { CarouselImagesView } from '~/app/admin/carousel-images/_components/carousel-images-view';
import { api } from '~/trpc/server';

export default async function CarouselImagePage() {
  const carouselImages = await api.carouselImage.getAll.query();

  return <CarouselImagesView initialData={carouselImages} />;
}
