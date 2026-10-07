import { carouselImageRouter } from '~/server/api/routers/carousel-image';
import { contactRouter } from '~/server/api/routers/contact';
import { pricingRouter } from '~/server/api/routers/pricing';
import { productRouter } from '~/server/api/routers/product';
import { quoteRequestRouter } from '~/server/api/routers/quote-request';
import { serviceRouter } from '~/server/api/routers/service';
import { createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  carouselImage: carouselImageRouter,
  service: serviceRouter,
  product: productRouter,
  contact: contactRouter,
  pricing: pricingRouter,
  quoteRequest: quoteRequestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
