import { Contact, ContactType } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '~/server/api/root';

function getContactTypeArrayRecord() {
  return (Object.keys(ContactType) as ContactType[]).reduce(
    (acc, key) => {
      acc[key] = [];
      return acc;
    },
    {} as Record<ContactType, Contact[]>
  );
}

export function sortContacts(
  contacts: Contact[] | inferRouterOutputs<AppRouter>['contact']['getAll']
) {
  return contacts.reduce((acc, contact) => {
    acc[contact.type].push(contact);
    return acc;
  }, getContactTypeArrayRecord());
}
