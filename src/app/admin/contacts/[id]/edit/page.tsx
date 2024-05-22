import { EditContactView } from '~/app/admin/contacts/[id]/edit/_components/edit-contact-view';
import { api } from '~/trpc/server';

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const contact = await api.contact.get.query({ id: params.id });

  return <EditContactView initialData={contact} />;
}
