import { ServiceDesignView } from '~/app/admin/services/[serviceName]/_components/service-design-view';

export default function ServiceProductPage({ params }: { params: { serviceName: string } }) {
  return <ServiceDesignView serviceName={params.serviceName} />;
}
