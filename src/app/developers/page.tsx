import { Facebook, Github, Globe, Instagram, Linkedin, Twitter } from 'lucide-react';
import { type Metadata } from 'next';

import { DeveloperCard } from '~/components/developer-card';

export const metadata: Metadata = {
  title: 'Website Developers',
  description:
    'This talented web development team, former interns at Three J Print Center, designed and built this website from the ground up. We honor their dedication to creating an online experience that reflects our commitment to quality printing and service. Thank you, Three J Kabsuhenyos!',
};

export default function DevelopersPage() {
  return (
    <main className="container flex flex-col gap-8 py-8">
      <section className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold">
          Meet the <span className="text-primary">Web Developers</span> behind Three J's Website
        </h1>

        <p className="max-w-screen-lg">
          This talented web development team, former interns at Three J Print Center, designed and
          built this website from the ground up. We honor their dedication to creating an online
          experience that reflects our commitment to quality printing and service. Thank you, Three
          J Kabsuhenyos!
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DeveloperCard
          name="Vonn Pactol"
          image="/pactol-avatar.png"
          initials="VP"
          title="Web Developer"
          socialLinks={[
            { Icon: Globe, link: 'https://sharp-pp.vercel.app' },
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
          image="/licuanan-avatar.jpg"
          initials="JL"
          title="Web Developer | IT & SEO Specialist"
          socialLinks={[
            {
              Icon: Globe,
              link: 'https://licuanan.vercel.app',
            },
            {
              Icon: Linkedin,
              link: 'https://www.linkedin.com/in/licuanan/',
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
          name="Bryan Vergara"
          image=""
          initials="BV"
          title="Web Developer"
          socialLinks={[
            {
              Icon: Linkedin,
              link: 'https://www.linkedin.com/in/vergarajohnbryan/',
            },
            { Icon: Facebook, link: 'https://www.facebook.com/vergarajohnbryan' },
          ]}
        />
      </section>
    </main>
  );
}
