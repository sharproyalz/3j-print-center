import { ServicesView } from '~/app/admin/services/_components/services-view';
import { api } from '~/trpc/server';
import { OrderBy } from '~/zod-schemas/service';

export default async function ServicePage() {
  const service = await api.service.getAll.query({ orderBy: OrderBy.DESC });

  return <ServicesView initialData={service} />;
}
