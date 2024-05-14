import { carouselImageSchemas } from '~/zod-schemas/carousel-image';
import { commonSchemas } from '~/zod-schemas/common';
import { contactSchemas } from '~/zod-schemas/contact';
import { serviceSchemas } from '~/zod-schemas/service';

export const schemas = {
  common: commonSchemas,
  carouselImage: carouselImageSchemas,
  service: serviceSchemas,
  contact: contactSchemas,
};
