import { ServiceDesignsView } from '~/app/services/[title]/[id]/_components/service-design-view';
import { api } from '~/trpc/server';

export default async function ServiceDesignsPage({ params }: { params: { id: string } }) {
  const service = await api.service.get.query({ id: params.id });
  const product = await api.product.getAll.query({ serviceId: service?.id as string });

  return <ServiceDesignsView serviceInitialData={service} productInitialData={product} />;
}
