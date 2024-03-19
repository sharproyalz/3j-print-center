import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <div className="flex justify-center bg-black p-4 text-xs text-white">
        <Link href={'#'} className="font-bold">
          About us
        </Link>
      </div>
    </>
  );
}
