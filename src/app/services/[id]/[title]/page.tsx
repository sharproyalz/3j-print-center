import { type Metadata } from 'next';
import { cache } from 'react';

import { ServiceDesignsView } from '~/app/services/[id]/[title]/_components/service-design-view';
import { api } from '~/trpc/server';

type Props = { params: Promise<{ id: string }> };

const getServiceById = cache((id: string) => api.service.get.query({ id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceById((await params).id);

  return {
    title: service?.title,
    description: service?.description,
  };
}

export default async function ServiceDesignsPage({ params }: { params: { id: string } }) {
  const [service, product] = await Promise.all([
    getServiceById(params.id),
    api.product.getAll.query({ serviceId: params.id }),
  ]);

  return <ServiceDesignsView serviceInitialData={service} productInitialData={product} />;
}
