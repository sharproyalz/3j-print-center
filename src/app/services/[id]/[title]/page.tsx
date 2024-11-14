import { type Metadata } from 'next';

import { ServiceDesignsView } from '~/app/services/[id]/[title]/_components/service-design-view';
import { api } from '~/trpc/server';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await api.service.get.query({ id: (await params).id });

  return {
    title: service?.title,
    description: service?.description,
  };
}

export default async function ServiceDesignsPage({ params }: { params: { id: string } }) {
  const service = await api.service.get.query({ id: params.id });
  const product = await api.product.getAll.query({ serviceId: service?.id as string });

  return <ServiceDesignsView serviceInitialData={service} productInitialData={product} />;
}
