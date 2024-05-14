import Image from 'next/image';
import Link from 'next/link';

export function NavigationBar() {
  return (
    <>
      <div className="sticky top-0 z-[999] flex h-[4.5rem] justify-between border-none bg-primary px-8  py-4 text-white">
        <div className="flex items-center gap-8">
          <Link href={`/`} className="flex items-center justify-center gap-4">
            <Image src="/3J-icon.png" alt="3J Logo" width={50} height={50} />{' '}
            <div className="text-lg">Print Center</div>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-lg">
          <Link href={`/#services`}>Services</Link>
          <Link href={`/#about`}>About</Link>
          <Link href={`/#contacts`}>Contact</Link>
        </div>
      </div>
    </>
  );
}
