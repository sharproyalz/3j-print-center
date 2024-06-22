import { Facebook, Github, Instagram, Linkedin, UserRound, X } from 'lucide-react';
import { DeveloperCard } from '~/components/developer-card';

export default function DevelopersPage() {
  return (
    <>
      <div className="my-8 ">
        <div className="text-center text-4xl font-semibold my-4">The Developers</div>
        <div className="mx-auto flex max-w-screen-xl flex-col gap-4 px-4 py-4 md:flex-row">
          <DeveloperCard
            name="Vonn Pactol"
            image="/VP-avatar.png"
            initials="VP"
            title="Web Developer"
            socialLinks={[
              { Icon: UserRound, link: 'https://sharp-pp.vercel.app/' },
              {
                Icon: Github,
                link: 'https://www.github.com/sharproyalz',
              },
              { Icon: Linkedin, link: 'https://www.linkedin.com/in/vonn-pactol-718a2a283/' },
              { Icon: Instagram, link: 'https://www.instagram.com/sharproyalz/' },
              { Icon: X, link: 'https://x.com/PactolVonn' },
            ]}
          />

          <DeveloperCard
            name="Justine Licuanan"
            image=""
            initials="JL"
            title="Web Developer"
            socialLinks={[]}
          />

          <DeveloperCard
            name="John Bryan Vergara"
            image=""
            initials="JV"
            title="Web Developer"
            socialLinks={[{ Icon: Facebook, link: 'https://web.facebook.com/vergarajohnbryan' }]}
          />
        </div>
      </div>
    </>
  );
}
