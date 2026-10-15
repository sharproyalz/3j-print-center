import { ServiceDesignView } from '~/app/admin/services/[id]/_components/service-design-view';
import { api } from '~/trpc/server';

export default async function ServiceProductPage({ params }: { params: { id: string } }) {
  const [service, product] = await Promise.all([
    api.service.get.query({ id: params.id }),
    api.product.getAll.query({ serviceId: params.id }),
  ]);

  return <ServiceDesignView serviceInitialData={service} productInitialData={product} />;
}
