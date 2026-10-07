import { type Metadata } from 'next';
import { Space_Mono, Work_Sans } from 'next/font/google';

import { ServiceGuideView } from '~/app/service-guide/_components/service-guide-view';
import { siteConfig } from '~/config/site';
import { cn } from '~/lib/utils';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-work-sans',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'Service Guide & Quotation',
  description: `Choose a printing service, share your requirements, and request a clear quotation from ${siteConfig.name}.`,
};

export default function ServiceGuidePage() {
  return (
    <div className={cn(workSans.variable, spaceMono.variable)}>
      <ServiceGuideView />
    </div>
  );
}
