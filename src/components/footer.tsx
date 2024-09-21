import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <div className="flex items-center justify-center gap-2 bg-black p-4 text-xs text-white">
        <div className="">
          © 2024 | Developed by{' '}
          <Link href={`/developers`} className="underline hover:text-white/80">
            Three J CvSU Interns
          </Link>
        </div>
      </div>
    </>
  );
}
