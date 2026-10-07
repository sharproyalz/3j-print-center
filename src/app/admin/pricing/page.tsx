import { PricingView } from '~/app/admin/pricing/_components/pricing-view';
import { api } from '~/trpc/server';

export default async function PricingPage() {
  const [rates, settings] = await Promise.all([
    api.pricing.getAll.query(),
    api.pricing.getSettings.query(),
  ]);

  return <PricingView initialRates={rates} initialSettings={settings} />;
}
