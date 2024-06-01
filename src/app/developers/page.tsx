import { Github } from 'lucide-react';
import { DeveloperCard } from '~/components/developer-card';

export default function DevelopersPage() {
  return (
    <>
      <div className="mx-auto max-w-lg py-4">
        <DeveloperCard
          name="Justine N. Licuanan"
          image=""
          initials="JL"
          title=""
          socialLinks={[
            {
              Icon: Github,
              link: 'https://github.com/JustineLicuanan',
              className: 'bg-black hover:bg-black/80',
            },
          ]}
        />
        {/* <DeveloperCard name="" image="" initials="" title="" socialLinks={[{}]} /> */}
      </div>
    </>
  );
}
