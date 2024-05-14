import { z } from 'zod';
import { CarouselImageAddView } from '~/app/admin/carousel-images/add/_components/add-view';
import { type schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.carouselImage.create>;

export default function CarouselImagePage() {
  return <CarouselImageAddView />;
}
