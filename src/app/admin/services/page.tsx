import { ServicesView } from '~/app/admin/services/_components/services-view';
import { api } from '~/trpc/server';

export default async function ServicePage() {
  const service = await api.service.getAll.query();

  return <ServicesView initialData={service} />;
}
