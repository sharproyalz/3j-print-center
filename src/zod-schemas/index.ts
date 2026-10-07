import { carouselImageSchemas } from '~/zod-schemas/carousel-image';
import { commonSchemas } from '~/zod-schemas/common';
import { contactSchemas } from '~/zod-schemas/contact';
import { pricingSchemas } from '~/zod-schemas/pricing';
import { productSchemas } from '~/zod-schemas/product';
import { quoteRequestSchemas } from '~/zod-schemas/quote-request';
import { serviceSchemas } from '~/zod-schemas/service';

export const schemas = {
  common: commonSchemas,
  carouselImage: carouselImageSchemas,
  service: serviceSchemas,
  product: productSchemas,
  contact: contactSchemas,
  pricing: pricingSchemas,
  quoteRequest: quoteRequestSchemas,
};
