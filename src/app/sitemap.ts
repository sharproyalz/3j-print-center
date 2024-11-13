import type { MetadataRoute } from 'next';

import { siteConfig } from '~/config/site';
import { api } from '~/trpc/server';
import { titleToSlug } from '~/utils/title-to-slug';
import { OrderBy } from '~/zod-schemas/service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await api.service.getAll.query({ orderBy: OrderBy.ASC });

  return [
    {
      url: siteConfig.origin,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...services.map(({ id, title, updatedAt }) => ({
      url: `${siteConfig.origin}/services/${titleToSlug(title)}/${id}`,
      lastModified: updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.origin}/developers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
