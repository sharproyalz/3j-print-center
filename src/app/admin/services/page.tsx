import { ServicesView } from '~/app/admin/services/_components/services-view';
import { api } from '~/trpc/server';

export default function ServicePage() {
  const service = api.service.getAll.query();

  return <ServicesView initialData={service} />;
}
