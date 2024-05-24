import EditServiceView from '~/app/admin/services/[id]/edit/_components/edit-service-view';
import { api } from '~/trpc/server';

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const service = await api.service.get.query({ id: params.id });

  return <EditServiceView initialData={service} />;
}
