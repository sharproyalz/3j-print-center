import { QuotesView } from '~/app/admin/quotes/_components/quotes-view';
import { api } from '~/trpc/server';

export default async function QuotesPage() {
  const quotes = await api.quoteRequest.getAll.query();

  return <QuotesView initialData={quotes} />;
}
