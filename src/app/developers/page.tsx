import { Facebook } from 'lucide-react';
import { DeveloperCard } from '~/components/developer-card';

export default function DevelopersPage() {
  return (
    <>
      <div className="mx-auto max-w-lg py-4">
        <DeveloperCard
          name="Vonn Pactol"
          image="/3J-logo.png"
          initials="VP"
          title="Web Developer"
          socialLinks={[{ Icon: Facebook, link: 'https://www.messenger.com' }]}
        />
      </div>
    </>
  );
}
