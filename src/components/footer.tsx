import Link from 'next/link';

import { siteConfig } from '~/config/site';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-muted-foreground">
      <section className="container flex flex-col justify-center py-8 text-center text-sm md:text-right">
        <p>
          &copy; 2014-{new Date().getFullYear()} {siteConfig.name}
        </p>

        <p>
          Developed by{' '}
          <Link href="/developers" className="text-[#f8fafc] transition-colors hover:text-primary">
            Three J Kabsuhenyos
          </Link>
        </p>
      </section>
    </footer>
  );
}
