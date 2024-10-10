import { Facebook, Github, Globe, Instagram, Linkedin, Twitter } from 'lucide-react';
import { DeveloperCard } from '~/components/developer-card';

export default function DevelopersPage() {
  return (
    <>
      <div className="my-8 ">
        <div className="my-4 text-center text-4xl font-semibold">The Developers</div>
        <div className="mx-auto flex max-w-screen-xl flex-col gap-4 px-4 py-4 md:flex-row">
          <DeveloperCard
            name="Vonn Pactol"
            image="/VP-avatar.png"
            initials="VP"
            title="Web Developer"
            socialLinks={[
              { Icon: Globe, link: 'https://sharp-pp.vercel.app/' },
              { Icon: Linkedin, link: 'https://www.linkedin.com/in/vonn-pactol-718a2a283/' },
              { Icon: Instagram, link: 'https://www.instagram.com/sharproyalz/' },
              { Icon: Twitter, link: 'https://x.com/PactolVonn' },
              {
                Icon: Github,
                link: 'https://www.github.com/sharproyalz',
              },
            ]}
          />

          <DeveloperCard
            name="Justine Licuanan"
            image="licuanan-avatar.png"
            initials="JL"
            title="Web Developer | IT & SEO Specialist"
            socialLinks={[
              {
                Icon: Globe,
                link: 'https://licuanan.vercel.app',
              },
              {
                Icon: Linkedin,
                link: 'https://www.linkedin.com/in/Licuanan',
              },
              {
                Icon: Twitter,
                link: 'https://x.com/JustineWaves',
              },
              {
                Icon: Github,
                link: 'https://www.github.com/JustineLicuanan',
              },
            ]}
          />

          <DeveloperCard
            name="John Bryan Vergara"
            image=""
            initials="JV"
            title="Web Developer"
            socialLinks={[{ Icon: Facebook, link: 'https://www.facebook.com/vergarajohnbryan' }]}
          />
        </div>
      </div>
    </>
  );
}
