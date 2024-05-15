import { carouselImageRouter } from '~/server/api/routers/carousel-image';
import { postRouter } from '~/server/api/routers/post';
import { serviceRouter } from '~/server/api/routers/service';
import { createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  carouselImage: carouselImageRouter,
  service: serviceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
