import ContactView from '~/app/admin/contacts/_components/contact-view';
import { api } from '~/trpc/server';

export default async function ContactPage() {
  const contact = await api.contact.getAll.query();

  return <ContactView initialData={contact} />;
}
