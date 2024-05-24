import { ServiceDesignView } from '~/app/admin/services/[id]/_components/service-design-view';
import { api } from '~/trpc/server';

export default async function ServiceProductPage({ params }: { params: { id: string } }) {
  const service = await api.service.get.query({ id: params.id });
  const product = await api.product.getAll.query({ serviceId: service?.id as string });

  return <ServiceDesignView serviceInitialData={service} productInitialData={product} />;
}
